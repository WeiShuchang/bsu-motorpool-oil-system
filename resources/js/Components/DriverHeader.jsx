import { Link, usePage } from '@inertiajs/react';
import { Car, LogOut } from 'lucide-react';

export default function DriverHeader() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <header className="bg-white border-b border-green-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-green-700 font-bold text-lg sm:text-xl">BSU Motorpool</h1>
                            <p className="text-xs sm:text-sm text-gray-500">Driver Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-green-100">
                        <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm text-gray-500">Welcome,</p>
                            <p className="font-medium text-green-700 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                                {user.name}
                            </p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center justify-center text-xs sm:text-sm font-medium border bg-white text-gray-700 hover:bg-green-50 h-7 sm:h-8 rounded-md gap-1 sm:gap-1.5 px-2.5 sm:px-3 border-green-200 transition-colors whitespace-nowrap"
                        >
                            <LogOut className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Logout</span>
                            <span className="xs:hidden">Exit</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}