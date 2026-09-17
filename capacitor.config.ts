import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aditya.profitableai',
  appName: 'Profitable AI App',
  webDir: 'out',
  server: {
    url: 'http://192.168.0.101:3000',
    cleartext: true
  }
};

export default config;
