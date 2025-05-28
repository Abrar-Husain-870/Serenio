import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

// Define a type for the user object we'll use in authentication
interface UserAuth {
  _id: string;
  id: string;
  name: string;
  email: string;
  googleId?: string;
}

// Extend Express types for session
declare global {
  namespace Express {
    interface User extends UserAuth {}
  }
}

const initializePassport = (): void => {
  // Check if Google credentials exist and are not the placeholder values
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  console.log('Initializing passport strategies...');
  console.log('Google Client ID:', googleClientId);
  console.log('Google Client Secret:', googleClientSecret ? '***' : undefined);
  
  if (!googleClientId || !googleClientSecret) {
    console.error('Google OAuth credentials are missing!');
    return;
  }
  
  console.log('Using Google OAuth credentials to initialize strategy');
  
  // Google OAuth Strategy
  passport.use(new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: 'http://localhost:3001/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile received:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails
        });
        
        if (!profile.emails || profile.emails.length === 0) {
          console.error('No email provided by Google');
          return done(new Error('No email provided by Google'));
        }

        const email = profile.emails[0].value;
        
        // Try to find existing user with googleId
        let user = await User.findOne({ googleId: profile.id });
        console.log('Existing user with googleId:', user ? 'Found' : 'Not found');
        
        // If user doesn't exist, check if there's a user with the same email
        if (!user) {
          user = await User.findOne({ email });
          console.log('Existing user with email:', user ? 'Found' : 'Not found');
          
          // If user exists with same email but no googleId, update the user
          if (user) {
            console.log('Updating existing user with googleId');
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create a new user
            console.log('Creating new user');
            user = await User.create({
              name: profile.displayName,
              email: email,
              googleId: profile.id
            });
          }
        }
        
        if (!user) {
          console.error('Failed to create or find user');
          return done(new Error('Failed to create or find user'));
        }
        
        // Create a plain object with the user data
        const userForAuth: UserAuth = {
          _id: user._id.toString(),
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          googleId: user.googleId
        };
        
        console.log('Successfully authenticated user:', {
          id: userForAuth.id,
          name: userForAuth.name,
          email: userForAuth.email
        });
        
        return done(null, userForAuth);
      } catch (error) {
        console.error('Error in Google strategy:', error);
        return done(error as Error);
      }
    }
  ));

  // Serialize and deserialize user with correct types
  passport.serializeUser((user: Express.User, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('Deserializing user:', id);
      const user = await User.findById(id);
      if (!user) {
        return done(new Error('User not found'));
      }
      
      const userForAuth: UserAuth = {
        _id: user._id.toString(),
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        googleId: user.googleId
      };
      
      done(null, userForAuth);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });
  
  console.log('Passport configuration completed');
};

export default initializePassport; 