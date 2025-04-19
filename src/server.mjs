
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let driverShift = {
  driverId: "123",
  licensePlate: "ABI ZX 2043",
  shiftId: "shift_001",
  vehicleId: "vehicle_456",
  vehicleName: "Volkswagen Passat Variant 2.0 TDI",
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  vehicleCheckDone: false
};

let rides = [];

const createRide = () => {
  const now = new Date();
  const rideDurationMinutes = 17;

  return {
    rideId: "ride_001",
    shiftId: driverShift.shiftId,
    pickupLocation: {
      address: "Lindenstraße 10, 06780 Zörbig, Saxony, Germany",
      time: now.toISOString()
    },
    dropoffLocation: {
      address: "Bahnhofstraße 5, 06766 Wolfen, Saxony, Germany"
    },
    rideStarted: false,
    rideStartTime: now.toISOString(),
    rideEndTime: new Date(now.getTime() + rideDurationMinutes * 60 * 1000).toISOString(),
    passengers: [
      { id: "p1", name: "Alice", status: "pending" },
      { id: "p2", name: "Bob", status: "pending" },
      { id: "p3", name: "Charlie", status: "pending" }
    ]
  };
};

app.get("/driver-shift", (req, res) => {
  const { driverId } = req.query;
  if (driverId === driverShift.driverId) {
    res.json(driverShift);
  } else {
    res.status(404).json({ message: "No shift found for this driver" });
  }
});

app.post("/vehicle-check", (req, res) => {
  const { carOk, licenseOk, lightsWorking, brakesWorking } = req.body;

  if (carOk && licenseOk && lightsWorking && brakesWorking) {
    driverShift.vehicleCheckDone = true;
    res.json({ message: "Vehicle check completed successfully" });

    const minDelay = 6 * 1000;
    const maxDelay = 15 * 1000;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      rides = [];
      rides.push(createRide());
      console.log("Ride assigned to shift");
    }, delay);
  } else {
    res.status(400).json({
      message: "Vehicle check failed. All checks must be marked true.",
      checklist: { carOk, licenseOk, lightsWorking, brakesWorking }
    });
  }
});

app.get("/ride-request", (req, res) => {
  const ride = rides.find(r => r.shiftId === driverShift.shiftId);

  if (!ride) {
    return res.status(404).json({ message: "No ride assigned yet" });
  }

  res.json(ride);
});

app.post("/check-in-passenger", (req, res) => {
  const { passengerId, action } = req.body;
  const ride = rides.find(r => r.shiftId === driverShift.shiftId);
  if (!ride) return res.status(404).json({ message: "No ride found" });

  const passenger = ride.passengers.find(p => p.id === passengerId);
  if (passenger) {
    passenger.status = action === "reject" ? "rejected" : "checked-in";
    res.json({ message: `Passenger ${action}ed`, passengers: ride.passengers });
  } else {
    res.status(404).json({ message: "Passenger not found" });
  }
});

app.post("/start-ride", (req, res) => {
  const ride = rides.find(r => r.shiftId === driverShift.shiftId);

  if (!ride) return res.status(404).json({ message: "No ride found" });

  const allHandled = ride.passengers.every(p => p.status === "checked-in" || p.status === "rejected");

  if (!allHandled) {
    return res.status(400).json({ message: "Not all passengers have been handled (checked-in or rejected)" });
  }

  ride.rideStarted = true;
  res.json({ message: "Ride started" });
});

app.listen(port, () => {
  console.log(`Mock driver API listening at http://localhost:${port}`);
});
