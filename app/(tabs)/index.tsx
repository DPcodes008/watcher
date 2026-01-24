import { useEffect } from "react";
import { Text, View } from "react-native";
import ExpoAndroidUsagestats from "expo-android-usagestats";

console.log("WATCHER FILE LOADED");

const IGNORED_PACKAGES = [
  "com.android.systemui",
  "com.google.android.permissioncontroller",
  "com.google.android.inputmethod.latin",
  "com.android.launcher",
  "com.nothing.launcher",
  "com.android.vending",
  "host.exp.exponent",
  "com.nothing.applocker",
  "com.anonymous.Watcher",
  "com.android.settings",
];

export default function HomeScreen() {
  useEffect(() => {
    let intervalId: any;

    const runWatcher = async () => {
      console.log("WATCHER TICK", new Date().toLocaleTimeString());

      const granted =
        await ExpoAndroidUsagestats.hasUsageStatsPermission();

      if (!granted) {
        await ExpoAndroidUsagestats.requestUsageStatsPermission();
        return;
      }

      // 🔹 LAST 1 DAY
      const now = Date.now();
      const oneHourAgo = now - 24*60 * 60 * 1000;

      const events =
        await ExpoAndroidUsagestats.getUsageEvents(oneHourAgo, now);

      // 🔹 STEP 1: filter noise
      const cleanedEvents = events.filter(
        (e) =>
          (e.eventTypeName === "MOVE_TO_FOREGROUND" ||
            e.eventTypeName === "MOVE_TO_BACKGROUND") &&
          !IGNORED_PACKAGES.includes(e.packageName)
      );

      // 🔹 STEP 2: build sessions
      let activeSession: {
        packageName: string;
        startTime: number;
      } | null = null;

      const sessions: {
        packageName: string;
        startTime: number;
        endTime: number;
        duration: number;
      }[] = [];

      for (const e of cleanedEvents) {
        if (e.eventTypeName === "MOVE_TO_FOREGROUND") {
          activeSession = {
            packageName: e.packageName,
            startTime: e.timeStamp,
          };
        }

        if (
          e.eventTypeName === "MOVE_TO_BACKGROUND" &&
          activeSession &&
          activeSession.packageName === e.packageName
        ) {
          const duration = e.timeStamp - activeSession.startTime;

          // discard micro-opens (< 3 sec)
          if (duration >= 3000) {
            sessions.push({
              packageName: e.packageName,
              startTime: activeSession.startTime,
              endTime: e.timeStamp,
              duration,
            });
          }

          activeSession = null;
        }
      }

      console.log("WATCHER 1DAY SESSIONS:", sessions);
    };

    // Run once immediately
    runWatcher();

    // Optional: re-run every 30s while app is open
    intervalId = setInterval(runWatcher, 30_000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Watcher running…</Text>
    </View>
  );
}

