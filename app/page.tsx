
import {auth, signOut} from "@/lib/auth";
import {redirect} from "next/navigation";


export default async function Home() {
  const session= await auth()
  if(!session) redirect('/sign-in')
  console.log(session);
  return (
    <div>
        Memora - app
        You are now logged in as a {session.user?.name}
        <img src={session.user?.image as string} alt=""/>
    </div>
  );
}
