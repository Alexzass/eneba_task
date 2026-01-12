import Image from "next/image";
import styles from "./page.module.css";

import Home from "@/components/Home";
import { connection } from 'next/server'

export default async function HomePage(
  {params}: {params: URLSearchParams}
) {
  await connection()
  return <Home/>
}
