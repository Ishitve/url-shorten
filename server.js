import express from "express";

const app = express();
app.use(express.json());

const urls = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}


app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: "Only http and https URLs are allowed" });
    }

    let code = generateCode();

   
    while (urls[code]) {
      code = generateCode();
    }

    urls[code] = parsedUrl.toString();

    const shortUrl = `http://localhost:3000/${code}`;

    res.status(201).json({
      originalUrl: urls[code],
      shortUrl,
      code
    });
  } catch {
    return res.status(400).json({ error: "Please enter a valid URL" });
  }
});


app.get("/:code", (req, res) => {
  const originalUrl = urls[req.params.code];

  if (!originalUrl) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(originalUrl);
});

app.get("/", (req, res) => {
  res.send("URL Shortener API is running. POST /shorten to create a short URL.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
