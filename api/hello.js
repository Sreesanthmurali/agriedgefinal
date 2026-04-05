export default function handler(request, response) {
  response.status(200).json({
    status: "ok",
    message: "Agri Edge Backend is ready. Note: This application is currently operating in true offline-first mode.",
    timestamp: new Date().toISOString()
  });
}
