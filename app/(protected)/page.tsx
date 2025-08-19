import {auth} from "@/lib/auth";
import Report from "@/components/dashboard/report/report";
import SharedDecks from "@/components/dashboard/shared-decks/shared-decks";
import Decks from "@/components/dashboard/decks/decks";

export default async function Dashboard() {
    const session = await auth()
    console.log(session);
    return (
        <div className={"flex w-full h-full justify-between "}>
            <div>
                <Report/>
                <SharedDecks/>
            </div>
            <div>
                <Decks/>
            </div>
        </div>
    );
}
