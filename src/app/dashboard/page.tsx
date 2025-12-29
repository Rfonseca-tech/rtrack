import { signout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Bem-vindo ao RTrack!</p>

            <form action={signout}>
                <Button variant="outline">Sair</Button>
            </form>
        </div>
    );
}
