// src/components/SpecialitesList.jsx
import Link from 'next/link';

export default function SpecialitesList({ specialities, errorOccurred }) {
    if (errorOccurred) {
        return <p className="text-center text-red-600 py-4">Impossible de charger les spécialités pour le moment.</p>;
    }

    if (!Array.isArray(specialities) || specialities.length === 0) {
        return <p className="text-center text-gray-600 py-4">Aucune spécialité disponible.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialities.map((specialite) => {
                // Ensure specialite and specialite.nom exist and specialite.nom is a string
                if (!specialite || typeof specialite.designation !== 'string') {
                    console.warn("Skipping invalid specialite data:", specialite);
                    return null; // Skip rendering this item
                }
                // Use specialite.id if available, otherwise fallback to an encoded name for the link/key
                const keyAndHrefId = specialite.specid || encodeURIComponent(specialite.designation);

                return (
                    <Link
                        href={`/specialites/${keyAndHrefId}`} // Adjust if your link structure is different
                        key={keyAndHrefId}
                        className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
                    >
                        <div className="flex justify-center  items-center">
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                {specialite.designation}
                            </h3>
                            
                             
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}