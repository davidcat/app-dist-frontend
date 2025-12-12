import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { AppList } from '../components/apps/AppList';

export function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <AppList />
            </main>

            <Footer />
        </div>
    );
}
