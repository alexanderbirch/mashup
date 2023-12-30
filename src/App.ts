import express from "express";
import CacheLookup from "./middleware/CacheLookup";
import CacheUpdate from "./middleware/CacheUpdate";
import CombineExternal from "./middleware/CombineExternal";
import ValidateRequest from "./middleware/ValidateRequest";

const app = express();
app.get("/mashup/:mbid", [ValidateRequest, CacheLookup, CombineExternal, CacheUpdate]);

export default app;