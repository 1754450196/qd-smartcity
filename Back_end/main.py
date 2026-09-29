# Back_end/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import stats  # ← 根据你的目录结构调整

app = FastAPI(title="青岛智慧城市 API")

# 允许前端跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 默认端口
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats.router, prefix="/api/stats", tags=["统计"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)