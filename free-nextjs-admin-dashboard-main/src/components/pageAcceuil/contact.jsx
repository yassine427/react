"use client";

import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from 'lucide-react';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea'; // Assurez-vous que le chemin est correct
import Button from '../ui/button/Button';
import Label from '../form/Label';

export default function ContactPage() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are not set!");
      setSubmitMessage("Erreur de configuration. Impossible d'envoyer le message.");
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (!formRef.current) {
      console.error("Form ref is not attached!");
      setSubmitMessage("Erreur interne du formulaire.");
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      console.log('EmailJS SUCCESS!');
      setSubmitMessage("Message envoyé avec succès ! Nous vous répondrons bientôt.");
      setSubmitStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS FAILED...', error);
      setSubmitMessage("Échec de l'envoi. Veuillez réessayer plus tard.");
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nous serions ravis d'avoir de vos nouvelles ! Que vous ayez une question sur nos services, besoin d'aide, ou simplement envie de discuter, n'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Coordonnées
            </h2>
            <div className="flex items-start space-x-4">
              <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Adresse</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  123 Avenue de la Clinique, Bureau 100<br />
                  Médenine, 4100<br />
                  Tunisie (Exemple)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <PhoneIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Téléphone</h3>
                <a href="tel:+21692458412" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  +216 92 458 412 (Exemple)
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MailIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">E-mail</h3>
                <a href="mailto:info@cliniqueroyal.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  info@cliniqueroyal.com (Exemple)
                </a>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notre emplacement</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52949.0619914313!2d10.46018884346154!3d33.34722117474864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1254df9be707357d%3A0x2d884f6d1e429376!2sMedenine!5e0!3m2!1sen!2stn!4v1714962000000!5m2!1sen!2stn" // Replace with your map embed URL
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte de localisation de la clinique"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Envoyez-nous un message
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jean Dupont"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Question sur les services"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <TextArea
                  id="message"
                  name="message"
                  placeholder="Votre message ici..."
                  required
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>
              <input type="hidden" name="time" value={new Date().toLocaleString()} />
              <div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </div>
              {submitStatus === 'success' && (
                <p className="text-center text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                  {submitMessage}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}