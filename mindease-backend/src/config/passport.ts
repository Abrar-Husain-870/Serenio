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
  console.log('Google Client ID provided:', !!googleClientId);
  console.log('Google Client Secret provided:', !!googleClientSecret);
  
  // Check for placeholder values
  const isPlaceholder = (value: string | undefined) => {
    return !value || 
      value.includes('your-') || 
      value === 'test-client-id' || 
      value === 'test-client-secret';
  };
  
  if (!googleClientId || !googleClientSecret) {
    console.error('Google OAuth credentials are missing!');
  } else if (isPlaceholder(googleClientId) || isPlaceholder(googleClientSecret)) {
    console.error('Google OAuth credentials appear to be placeholder values!');
  } else {
    console.log('Using Google OAuth credentials to initialize strategy');
    
    // Google OAuth Strategy
    passport.use(
      'google',
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: 'http://localhost:3001/api/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log('Google profile:', profile);
            
            // Try to find existing user with googleId
            let user = await User.findOne({ googleId: profile.id });
            
            // If user doesn't exist, check if there's a user with the same email
            if (!user && profile.emails && profile.emails.length > 0) {
              const email = profile.emails[0].value;
              user = await User.findOne({ email });
              
              // If user exists with same email but no googleId, update the user
              if (user) {
                user.googleId = profile.id;
                await user.save();
              } else {
                // Create a new user
                user = await User.create({
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  googleId: profile.id
                });
              }
            }
            
            if (!user) {
              return done(null, false);
            }
            
            // Create a plain object with the user data
            const userForAuth: UserAuth = {
              _id: user._id.toString(),
              id: user._id.toString(), // Include both _id and id for compatibility
              name: user.name,
              email: user.email,
              googleId: user.googleId
            };
            
            return done(null, userForAuth);
          } catch (error) {
            console.error('Error in Google strategy:', error);
            return done(error as Error);
          }
        }
      )
    );
  }

  // Serialize and deserialize user with correct types
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });

  passport.deserializeUser<Express.User>((user, done) => {
    done(null, user);
  });
  
  // Log that we've registered the strategy
  console.log('Passport configuration completed');
};

export default initializePassport; 