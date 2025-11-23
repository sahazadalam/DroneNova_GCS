"""
ONE-LINE TEST SERVER - Absolute simplest
"""
import asyncio, websockets, json, time, random

async def handler(ws, path):
    connected.add(ws)
    try:
        await ws.send('{"status":"connected"}')
        await ws.wait_closed()
    finally:
        connected.discard(ws)

connected = set()

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("✅ Server running on ws://localhost:8765")
        data = {"lat":51.5074, "lon":-0.1278, "alt":100}
        while True:
            for ws in connected.copy():
                try:
                    data["lat"] += random.uniform(-0.001, 0.001)
                    data["lon"] += random.uniform(-0.001, 0.001)
                    await ws.send(json.dumps({"telemetry": data}))
                except: connected.discard(ws)
            await asyncio.sleep(0.1)

asyncio.run(main())