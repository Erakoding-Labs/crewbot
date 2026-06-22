import { redirect } from "next/navigation";

/** Entry point — send visitors to the mock login. */
export default function Home() {
  redirect("/login");
}
