import { Link, usePage } from '@inertiajs/react';
import { Car, LogOut } from 'lucide-react';

export default function DriverHeader() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <header className="bg-white border-b border-green-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
           
                        <div>
                            <h1 className="text-green-700 font-bold text-xl">BSU Motorpool</h1>
                            <p className="text-sm text-gray-500">Driver Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Welcome,</p>
                            <p className="font-medium text-green-700">{user.name}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center justify-center text-sm font-medium border bg-white text-gray-700 hover:bg-green-50 h-8 rounded-md gap-1.5 px-3 border-green-200 transition-colors"
                        >
                            <LogOut className="size-4 mr-2" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}