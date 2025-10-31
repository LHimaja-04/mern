import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const SAMPLE = [
  { title: "Algorithms 101 (E-Book)", desc: "Crisp intro to algorithms.", price: 199, rating: 4.6, category: "Books", img: "https://picsum.photos/seed/algos101/640/400" },
  { title: "System Design Primer (PDF)", desc: "Scalable systems, diagrams.", price: 299, rating: 4.5, category: "Books", img: "https://picsum.photos/seed/sysdesign/640/400" },
  { title: "Python for Data Science", desc: "Pandas, NumPy, ML quickstart.", price: 249, rating: 4.6, category: "Books", img: "https://picsum.photos/seed/pyds/640/400" },
  { title: "Premium Notebook (A5, 200p)", desc: "Dot-grid, lay-flat.", price: 149, rating: 4.3, category: "Stationery", img: "https://picsum.photos/seed/notebook/640/400" },
  { title: "Tri-Grip Ball Pens (10 pack)", desc: "0.7mm, exam-friendly.", price: 99, rating: 4.2, category: "Stationery", img: "https://picsum.photos/seed/penpack/640/400" },
  { title: "Electronics Starter Kit", desc: "Breadboard, sensors.", price: 799, rating: 4.4, category: "Kits", img: "https://picsum.photos/seed/eleckit/640/400" },
  { title: "Robotics Kit Jr.", desc: "Build mini bots.", price: 1199, rating: 4.7, category: "Kits", img: "https://picsum.photos/seed/robokit/640/400" },
  { title: "DSA Crash Course (Video)", desc: "Arrays → Graphs.", price: 499, rating: 4.6, category: "Courses", img: "https://picsum.photos/seed/dsacourse/640/400" },
  { title: "System Design Live (Cohort)", desc: "High-scale systems.", price: 1499, rating: 4.8, category: "Courses", img: "https://picsum.photos/seed/syslive/640/400" }
];

(async () => {
  await connectDB(process.env.MONGODB_URI);
  await Product.deleteMany({});
  const out = await Product.insertMany(SAMPLE);
  console.log(`✓ Seeded ${out.length} products`);
  process.exit(0);
})();
