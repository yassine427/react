import {fetchSpecialites} from '../../services/SpecialiteService';
import SpecialitesList from '../../components/pageAcceuil/SpecialitesList'
export default async function NosSpecialitesPage() {
    let specialities = []; // Default to an empty array
    let fetchError = null;

    try {
        specialities = await fetchSpecialites();
    } catch (error) {
        console.error("Erreur sur la page NosSpécialités lors du chargement des données:", error.message);
        fetchError = error; // Store the error object or a message
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 sm:text-5xl">
                        NOS SPÉCIALITÉS
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        L'activité médicale, chirurgicale et obstétricale de l'Hôpital Américain de
                        Paris est organisée en unités. Les Responsables d'Unités sont désignés par le
                        Conseil des Gouverneurs après avis du Conseil Médical.
                    </p>
                </div>

                {/* Render the list or an error message */}
                <SpecialitesList specialities={specialities} errorOccurred={!!fetchError} />

                {/* Optional: Display a more detailed error message directly on the page if needed */}
                {fetchError && (
                    <div className="mt-8 text-center p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        <p><strong>Un problème est survenu :</strong> {fetchError.message || "Impossible de contacter le service."}</p>
                        <p className="text-sm">Veuillez vérifier votre connexion ou réessayer plus tard.</p>
                    </div>
                )}
            </div>
        </div>
    );
}