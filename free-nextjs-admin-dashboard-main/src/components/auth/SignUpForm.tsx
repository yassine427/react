"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../services/userService";

export interface SignUpFormData {
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  imageart: string;
  sexe: "H" | "F";
  password: string;
  invitationCode: string;
}

type SignUpFormErrors = {
  [K in keyof SignUpFormData]?: string;
} & {
  terms?: string;
  submit?: string;
};

const validationRequiredFields: (keyof SignUpFormData)[] = [
  "prenom",
  "nom",
  "email",
  "tel",
  "password",
  "invitationCode",
];

const formFields: {
  label: string;
  name: keyof SignUpFormData;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  halfWidth?: boolean;
}[] = [
  { label: "Prénom", name: "prenom", placeholder: "Entrez votre prénom", type: "text", halfWidth: true },
  { label: "Nom", name: "nom", placeholder: "Entrez votre nom", type: "text", halfWidth: true },
  { label: "Email", name: "email", placeholder: "exemple@domaine.com", type: "email" },
  { label: "Téléphone", name: "tel", placeholder: "Numéro de téléphone", type: "tel" },
  { label: "Code de vérification", name: "invitationCode", placeholder: "Code reçu par secretaire", type: "text" },
  { label: "Image (URL)", name: "imageart", placeholder: "Lien vers votre avatar", type: "text" },
];

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
 
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<SignUpFormData>({
    prenom: "",
    nom: "",
    email: "",
    tel: "",
    imageart: "",
    sexe: "H",
    password: "",
    invitationCode: "",
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};
    const labels: Record<keyof SignUpFormData, string> = {
      prenom: "Prénom",
      nom: "Nom",
      email: "Email",
      tel: "Numéro de téléphone",
      password: "Mot de passe",
      invitationCode: "Code de vérification",
      imageart: "Image",
      sexe: "Sexe",
    };

    for (const key of validationRequiredFields) {
      if (!form[key]) {
        newErrors[key] = `Le champ '${labels[key]}' est requis`;
      }
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (form.tel && !/^\d{8,}$/.test(form.tel)) {
      newErrors.tel = "Numéro de téléphone invalide (minimum 8 chiffres)";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof SignUpFormData;
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSexeChange = (value: string) => {
    const sexe = value as "H" | "F";
    setForm(prev => ({ ...prev, sexe }));
    if (errors.sexe) {
      setErrors(prev => ({ ...prev, sexe: undefined }));
    }
  };

 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, submit: undefined }));

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await registerUser(form);
        if (response.success) {
          alert(response.message || "Inscription réussie !");
          setForm({
            prenom: "",
            nom: "",
            email: "",
            tel: "",
            imageart: "",
            sexe: "H",
            password: "",
            invitationCode: "",
          });
         
          router.push("/login");
        } else {
          setErrors(prev => ({ ...prev, submit: response.message || "Erreur lors de l'inscription." }));
        }
      } catch (error: any) {
        const msg = error instanceof Error ? error.message : "Erreur inconnue";
        setErrors(prev => ({ ...prev, submit: msg }));
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(prev => ({ ...prev, submit: "Veuillez corriger les erreurs dans le formulaire." }));
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
        Créer un compte
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Entrez vos informations pour vous inscrire !
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {formFields.filter(f => f.halfWidth).map(field => (
            <div key={field.name}>
              <Label htmlFor={field.name}>
                {field.label}<span className="text-error-500">*</span>
              </Label>
              <Input
                {...field}
                value={form[field.name]}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors[field.name] && (
                <p className="text-error-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {formFields.filter(f => !f.halfWidth).map(field => (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}{validationRequiredFields.includes(field.name) && <span className="text-error-500">*</span>}
            </Label>
            <Input
              {...field}
              value={form[field.name]}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors[field.name] && (
              <p className="text-error-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div>
          <Label htmlFor="password">Mot de passe<span className="text-error-500">*</span></Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span
              onClick={() => !isLoading && setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
          {errors.password && (
            <p className="text-error-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <Label>Sexe<span className="text-error-500">*</span></Label>
          <div className="flex items-center gap-x-5 mt-2">
            <Radio id="sexe-h" name="sexe" value="H" checked={form.sexe === "H"} onChange={handleSexeChange} label="Homme" disabled={isLoading} />
            <Radio id="sexe-f" name="sexe" value="F" checked={form.sexe === "F"} onChange={handleSexeChange} label="Femme" disabled={isLoading} />
          </div>
          {errors.sexe && <p className="text-error-500 text-xs mt-1">{errors.sexe}</p>}
        </div>

      

        <button
          type="submit"
          className="w-full px-4 py-3 text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </button>
        {errors.submit && (
          <p className="text-error-500 text-xs mt-2 text-center">{errors.submit}</p>
        )}
      </form>

      <div className="mt-5 text-sm text-center text-gray-500">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-brand-500 underline">Se connecter</Link>
      </div>
    </div>
  );
}
