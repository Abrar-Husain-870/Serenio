import React, { useEffect } from 'react';
import { Box, Stack, Alert } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeAlert, AppAlert } from '../store/slices/alertSlice';
import type { RootState } from '../store';

const DEFAULT_DURATION = 3000;

const GlobalAlerts: React.FC = () => {
  const alerts = useAppSelector((s: RootState) => s.alerts.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timers = alerts.map((a: AppAlert) => {
      const duration = a.durationMs ?? DEFAULT_DURATION;
      if (duration <= 0) return null;
      const t = window.setTimeout(() => dispatch(removeAlert(a.id)), duration);
      return t;
    }).filter(Boolean) as number[];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [alerts, dispatch]);

  if (!alerts.length) return null;

  return (
    <Box position="fixed" top={4} right={4} zIndex={1000}>
      <Stack gap={3} align="flex-end">
        {alerts.map((a: AppAlert) => (
          <Alert.Root key={a.id} status={a.status}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{a.title}</Alert.Title>
              {a.description ? (
                <Alert.Description>{a.description}</Alert.Description>
              ) : null}
            </Alert.Content>
          </Alert.Root>
        ))}
      </Stack>
    </Box>
  );
};

export default GlobalAlerts;
