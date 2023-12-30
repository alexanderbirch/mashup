import app from "./App";

const PORT: Number = 5050;

const server = app.listen(PORT, (): void => console.log(`running on port ${PORT}`))
