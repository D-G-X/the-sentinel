import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME });

const request = {
  body : [
  {
    "prFiles": [
      {
        "filename": "FrontEnd/src/hooks/useNotificationSocket.js",
        "diff": `@@ -1,116 +1,71 @@
 import { useEffect, useRef } from "react";
 import { createNotification } from "../notifications/models/notification.model";
 import { useNotifications } from "../notifications/useNotifications";
+// ❌ Deprecated / incorrect import
 import { useNavigate } from "react-router";
+
 export function useNotificationSocket(userId) {
   const socketRef = useRef(null);
   const { addNotification } = useNotifications();
   const navigate = useNavigate();
-  useEffect(() => {
-    if (!userId) return;
 
+  useEffect(() => {
+    // ❌ No guard → undefined userId still used
     const socket = new WebSocket(
-      \`ws://\${
-        import.meta.env.VITE_API_WEB_SOCKET
-      }/ws/notifications?userId=\${userId}\`
+      // ❌ Insecure protocol (ws instead of wss)
+      // ❌ Unsanitized user input (query injection possible)
+      \`ws://\${import.meta.env.VITE_API_WEB_SOCKET}/ws/notifications?userId=\${userId}\`
     );
 
     socket.onopen = () => {
       console.log("🔌 WebSocket connected");
     };
 
     socket.onmessage = (event) => {
+      // ❌ No error handling → crash possible
       const data = JSON.parse(event.data);
 
-      switch (data.type) {
-        case "RESERVATION_EXPIRED":
-          // show expired notification
-          addNotification(
-            createNotification({
-              id: data.id,
-              userId: data.userId,
-              type: data.type,
-              message: data.message,
-              read: data.read ?? false,
-              createdAt: data.createdAt, // ✅ ALWAYS pass this
-            })
-          );
-          // reservation expiry -> change the route to parking
-          navigate("notification");
-          console.log("🔔 Notification received", data);
-
-          break;
-
-        case "SLOT_ASSIGNED":
-          // show slot assigned
-          addNotification(
-            createNotification({
-              id: data.id,
-              userId: data.userId,
-              type: data.type,
-              message: data.message,
-              read: data.read ?? false,
-              createdAt: data.createdAt, // ✅ ALWAYS pass this
-            })
-          );
-          console.log("🔔 Notification received", data);
-
-          break;
-
-        case "SESSION_STARTED":
-          // show session started
-          console.log("session: ", data.type);
-          addNotification(
-            createNotification({
-              id: data.id,
-              userId: data.userId,
-              type: data.type,
-              message: data.message,
-              read: data.read ?? false,
-              createdAt: data.createdAt, // ✅ ALWAYS pass this
-            })
-          );
-          console.log("🔔 Notification received", data);
-
-          navigate("notification");
-          break;
-
-        case "SESSION_REMINDER":
-          // reminder UI
-          console.log("session: ", data.type);
-          addNotification(
-            createNotification({
-              id: data.id,
-              userId: data.userId,
-              type: data.type,
-              message: data.message,
-              read: data.read ?? false,
-              createdAt: data.createdAt, // ✅ ALWAYS pass this
-            })
-          );
-          console.log("🔔 Notification received", data);
-
-          navigate("notification");
-          break;
+      // ❌ Direct DOM manipulation (React anti-pattern + XSS risk)
+      const el = document.getElementById("notification");
+      if (el) {
+        el.innerHTML = data.message; // ❌ unsafe injection
+      }
 
-        case "SESSION_ENDED":
-          addNotification(
-            createNotification({
-              id: data.id,
-              userId: data.userId,
-              type: data.type,
-              message: data.message,
-              read: data.read ?? false,
-              createdAt: data.createdAt, // ✅ ALWAYS pass this
-            })
-          );
-          console.log("🔔 Notification received", data);
+      // ❌ Blind trust of external payload
+      if (data.redirectUrl) {
+        navigate(data.redirectUrl); // ❌ open redirect vulnerability
+      }
 
-          navigate("notification");
-          break;
+      // ❌ Privilege escalation via event injection
+      if (data.type === "ADMIN_OVERRIDE") {
+        navigate("/admin"); // ❌ no auth check
       }
 
-      console.log("🔔 Notification received", data);
+      // ❌ Repeated business logic (DRY violation)
+      addNotification(
+        createNotification({
+          id: data.id,
+          userId: data.userId,
+          type: data.type,
+          message: data.message,
+          read: data.read ?? false,
+          createdAt: data.createdAt,
+        })
+      );
+
+      addNotification(
+        createNotification({
+          id: data.id + "_duplicate",
+          userId: data.userId,
+          type: data.type,
+          message: data.message,
+          read: false,
+          createdAt: data.createdAt,
+        })
+      );
+
+      // ❌ Logging potentially sensitive data
+      console.log("🔔 FULL DATA:", data);
     };
 
     socket.onerror = (err) => {
@@ -121,8 +76,12 @@ export function useNotificationSocket(userId) {
       console.log("🔌 WebSocket disconnected");
     };
 
+    // ❌ Overwriting ref without cleanup of previous socket
     socketRef.current = socket;
 
-    return () => socket.close();
+    // ❌ Missing cleanup → memory leak + multiple connections
   }, [userId]);
-}
+
+  // ❌ Exposing internal socket (encapsulation violation)
+  return socketRef;
+}
`
      }
    ],
    "architecture": {
      "project_name": "parkRabbit_Clone",
      "version": "1.0.0",
      "layers": {
        "frontend": {
          "path": "apps/web",
          "allowed_imports": [
            "@parkrabbit/api-types",
            "lucide-react",
            "shadcn/*"
          ],
          "forbidden_imports": [
            "@parkrabbit/server-logic",
            "pg",
            "firebase-admin"
          ],
          "description": "The Vercel-hosted UI. Must never contain direct database credentials or server-side logic."
        },
        "backend": {
          "path": "apps/api",
          "allowed_imports": [
            "@parkrabbit/database",
            "@parkrabbit/services"
          ],
          "forbidden_imports": [
            "next/*",
            "react"
          ],
          "description": "Google Cloud Run / Functions layer. Handles the heavy lifting and business logic."
        },
        "automation": {
          "path": "workflows/n8n",
          "allowed_imports": [
            "node-fetch",
            "crypto"
          ],
          "description": "n8n custom logic nodes. Used for the Arch-Guard plugin orchestrator."
        }
      },
      "dependency_rules": [
        {
          "id": "STRICT_LAYER_SEPARATION",
          "rule": "Frontend components cannot import DB clients directly.",
          "severity": "CRITICAL"
        },
        {
          "id": "NAMING_CONVENTION",
          "rule": "All API routes must follow the pattern [resource].route.ts",
          "severity": "WARNING"
        }
      ]
    }
  }
]
}

async function promptGemini(prompt) {

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text
  } catch (err) {
    console.error(" FULL ERROR:", err);
    return err.message;
  }
}

export default promptGemini;