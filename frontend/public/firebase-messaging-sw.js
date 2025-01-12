self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    event.waitUntil(clients.openWindow(event.notification.data.url));
});

self.addEventListener('push', function(event) {
    const notificationData = event.data.json();  // obține întregul payload
    const notification = notificationData.notification;  // notificarea este în sub-obiectul 'notification'

    console.log("[Service Worker] Push Received.");

    event.waitUntil(self.registration.showNotification(notification.title, {
        body: notification.body, // Poți adăuga o icoană dacă ai una definită
        data: {
            url: notificationData.data.url // Aici folosești `click_action` din `data`
        }
    }));
});