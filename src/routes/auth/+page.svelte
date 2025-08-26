<div class="min-h-screen bg-base-200 flex">
    <!-- Formulaire à gauche -->
    <div class="flex-1 flex items-center justify-center p-8">
        <div class="card w-full max-w-md bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold text-center mb-6">
                    Connexion
                </h2>
                
                <form method="POST" action="?/login" class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="votre@email.com"
                            class="input input-bordered w-full" 
                            required 
                        />
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Mot de passe</span>
                        </label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••"
                            class="input input-bordered w-full" 
                            required 
                        />
                    </div>
                    
                    <div class="form-control mt-6">
                        <button class="btn btn-primary w-full">
                            Se connecter
                        </button>
                    </div>
                    
                    <div class="form-control">
                        <button formaction="?/signup" type="submit" class="btn btn-outline w-full">
                            Créer un compte avec ces identifiants
                        </button>
                    </div>
                </form>
                
                <div class="text-center mt-4">
                    <a href="/" class="link link-primary text-sm">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Logo et nom de l'app à droite -->
    <div class="flex-1 bg-white flex items-center justify-center p-8">
        <div class="text-center">
            <div class="mb-6">
                <img 
                    src="/favicon.png" 
                    alt="AdNote Logo" 
                    class="w-24 h-24 mx-auto drop-shadow-lg"
                />
            </div>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                AdNote
            </h1>
            <p class="text-xl text-gray-600 max-w-md">
                Organisez vos idées, créez des notes structurées et planifiez votre temps.
            </p>
            <div class="mt-8 space-y-2">
                <div class="flex items-center justify-center gap-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Prise de notes style Notion</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Gestion de calendrier</span>
                </div>
            </div>
        </div>
    </div>
</div>
