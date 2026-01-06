To build an **APK** (Android app package) with Expo, you have two main paths depending on whether you’re using the **classic Expo build service** or the newer **EAS Build (Expo Application Services)**.  

---

## 🔹 Modern Way (Recommended): EAS Build
Expo now recommends using **EAS Build**, which supports both managed and bare workflows.

### Steps
1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to Expo**
   ```bash
   eas login
   ```
3. **Configure your project**
   - Run:
     ```bash
     eas build:configure
     ```
   - This creates an `eas.json` file where you can define build profiles.
4. **Build APK**
   - For a development APK (easy to install on devices):
     ```bash
     eas build -p android --profile preview
     ```
   - For a production APK:
     ```bash
     eas build -p android --profile production
     ```
   - By default, EAS generates **AAB** (Android App Bundle) for Play Store. If you specifically want an **APK**, you can set `"buildType": "apk"` in your `eas.json` profile:
     ```json
     {
       "build": {
         "preview": {
           "android": {
             "buildType": "apk"
           }
         }
       }
     }
     ```
5. **Download the APK**
   - After the build finishes, Expo gives you a link to download the APK.

---

## 🔹 Legacy Way (Not recommended anymore)
Expo used to support:
```bash
expo build:android
```
But this is deprecated in favor of EAS Build. If you run it today, you’ll be prompted to migrate.

---

## ⚡ Key Notes
- **AAB vs APK**: Google Play requires **AAB** for publishing, but APKs are still useful for testing or direct installs.
- **Managed workflow**: You don’t need Android Studio; Expo handles everything.
- **Bare workflow**: You can still use EAS Build, but you also have the option to build locally with Gradle.

---

👉 If you’re just testing on devices, set `buildType: "apk"` in `eas.json`. If you’re publishing to Play Store, stick with the default AAB.

Would you like me to show you a **ready-to-use `eas.json` config** that outputs both APK (for testing) and AAB (for publishing) so you don’t have to switch settings manually?