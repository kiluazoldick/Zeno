export const users = [
  {
    id: "1",
    name: "Arham Khan",
    username: "Aarhamkhnz",
    email: "hello@arhamkhnz.com",
    avatar: "https://avatars.githubusercontent.com/u/43849669",
    role: "administrator",
  },
  {
    id: "2",
    name: "Ammar Khan",
    username: "ammarkhnz",
    email: "hello@ammarkhnz.com",
    avatar: "",
    role: "admin",
  },
];
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

const session = await getSession();
     console.log("la session est :",  session);
    if (!session) redirect("/login");
  
    const currentUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatar: session.user.image ?? "",
      role: session.user.role ?? "membre",
    };

export const rootUser = currentUser;
