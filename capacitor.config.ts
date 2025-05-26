import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thementalpitch.app',
  appName: 'The Mental Pitch',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'http',
    allowNavigation: ['*'],
    hostname: 'localhost'
  },
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
    scheme: 'app'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
