import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.foodstream.clamflow',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true,
    enableScreenCapture: true
  }
} as NativeScriptConfig;