"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, FlaskConical, LogIn, RotateCcw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CTAButton } from "@/components/ui/Button";
import { FormCard } from "@/components/forms/FormShell";
import { Stepper, type StepMeta } from "@/components/forms/wizard/Stepper";
import { StepAccount } from "@/components/forms/wizard/StepAccount";
import { StepRestaurant } from "@/components/forms/wizard/StepRestaurant";
import { StepBusiness } from "@/components/forms/wizard/StepBusiness";
import { StepImages } from "@/components/forms/wizard/StepImages";
import { StepConfirm } from "@/components/forms/wizard/StepConfirm";
import { StatusTimeline } from "@/components/forms/wizard/StatusTimeline";
import { statusById } from "@/data/restaurantRegistration";
import { mainAppLink } from "@/lib/supabase";
import { submitRestaurantRegistration } from "@/lib/realSubmission";
import {
  clearDraft,
  loadDraft,
  saveDraft,
  type PickedImage,
  type Step1,
  type Step2,
  type Step3,
} from "@/lib/restaurantRegistration";

/* ==========================================================================
   MODO SIMULACIÓN

   En `true` el asistente NO escribe en Supabase: valida todo, muestra el
   resumen y simula el envío. Es el modo correcto mientras la base de datos
   no tenga las columnas nuevas (marca, teléfono, ciudad, estado, código
   postal, tipo, modalidad, horario, estado de revisión) ni un bucket donde
   guardar el logo y la portada.

   Para conectarlo de verdad: aplicar la migración SQL, crear el bucket y
   poner esta constante en `false`.
   ========================================================================== */
const SIMULATION = false;

const steps: StepMeta[] = [
  { id: 1, label: "Datos del responsable", short: "Responsable" },
  { id: 2, label: "Datos del restaurante", short: "Restaurante" },
  { id: 3, label: "Información del negocio", short: "Negocio" },
  { id: 4, label: "Logo y portada", short: "Imágenes" },
  { id: 5, label: "Revisa y confirma", short: "Confirmar" },
];

export function RestaurantWizard() {
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [step1, setStep1] = useState<Step1 | null>(null);
  const [step2, setStep2] = useState<Step2 | null>(null);
  const [step3, setStep3] = useState<Step3 | null>(null);
  const [logo, setLogo] = useState<PickedImage | null>(null);
  const [cover, setCover] = useState<PickedImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [restored, setRestored] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  /** Recupera el avance guardado (nunca la contraseña ni las imágenes). */
  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    if (draft.step1) setStep1({ ...(draft.step1 as Step1), password: "", confirm: "" });
    if (draft.step2) setStep2(draft.step2 as Step2);
    if (draft.step3) setStep3(draft.step3 as Step3);
    // Siempre se vuelve al paso 1: la contraseña no se guarda y hay que reescribirla.
    setFurthest(Math.max(draft.step ?? 1, 1));
    setRestored(true);
  }, []);

  /** Al cambiar de paso, sube al principio del formulario. */
  useEffect(() => {
    if (step > 1) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const persist = (nextStep: number, data?: Partial<{ s1: Step1; s2: Step2; s3: Step3 }>) => {
    const s1 = data?.s1 ?? step1;
    saveDraft({
      step: nextStep,
      // La contraseña nunca sale del formulario.
      step1: s1
        ? { ownerName: s1.ownerName, ownerPhone: s1.ownerPhone, email: s1.email }
        : {},
      step2: (data?.s2 ?? step2) ?? {},
      step3: (data?.s3 ?? step3) ?? {},
      savedAt: new Date().toISOString(),
    });
  };

  const advance = (to: number) => {
    setStep(to);
    setFurthest((f) => Math.max(f, to));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    if (SIMULATION) {
      // Se simula la latencia real de creación de cuenta + alta del negocio.
      await new Promise((r) => setTimeout(r, 1400));
      setSubmitting(false);
      setDone(true);
      clearDraft();
      return;
    }

    if (!step1 || !step2 || !step3) {
      setSubmitting(false);
      setError("Faltan datos del formulario. Vuelve a los pasos anteriores.");
      return;
    }

    try {
      await submitRestaurantRegistration(step1, step2, step3, logo, cover);
      setSubmitting(false);
      setDone(true);
      clearDraft();
    } catch (e) {
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "No se pudo completar el registro. Intenta de nuevo.");
    }
  };

  if (done) {
    return <RegistrationComplete restaurantName={step2?.restaurantName ?? ""} />;
  }

  return (
    <div ref={topRef} className="flex flex-col gap-6">
      {SIMULATION && <SimulationNotice />}

      <FormCard className="!p-5 sm:!p-6">
        <Stepper steps={steps} current={step} furthest={furthest} onJump={setStep} />
      </FormCard>

      {restored && step === 1 && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.04] p-4 text-sm">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="flex-1 text-muted">
            Recuperamos el avance de tu registro anterior. Por seguridad, la contraseña no se
            guarda: tendrás que escribirla de nuevo.
          </span>
          <button
            type="button"
            onClick={() => {
              clearDraft();
              setRestored(false);
              setStep1(null);
              setStep2(null);
              setStep3(null);
              setFurthest(1);
            }}
            className="shrink-0 text-xs font-bold text-primary underline underline-offset-4"
          >
            Empezar de cero
          </button>
        </div>
      )}

      <FormCard>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <StepAccount
                defaults={step1 ?? {}}
                onNext={(values) => {
                  setStep1(values);
                  persist(2, { s1: values });
                  advance(2);
                }}
              />
            )}

            {step === 2 && (
              <StepRestaurant
                defaults={step2 ?? {}}
                onBack={() => setStep(1)}
                onNext={(values) => {
                  setStep2(values);
                  persist(3, { s2: values });
                  advance(3);
                }}
              />
            )}

            {step === 3 && (
              <StepBusiness
                defaults={step3 ?? {}}
                onBack={() => setStep(2)}
                onNext={(values) => {
                  setStep3(values);
                  persist(4, { s3: values });
                  advance(4);
                }}
              />
            )}

            {step === 4 && (
              <StepImages
                logo={logo}
                cover={cover}
                onLogo={setLogo}
                onCover={setCover}
                onBack={() => setStep(3)}
                onNext={() => advance(5)}
              />
            )}

            {step === 5 && step1 && step2 && step3 && (
              <StepConfirm
                step1={step1}
                step2={step2}
                step3={step3}
                logo={logo}
                cover={cover}
                onEdit={setStep}
                onBack={() => setStep(4)}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </FormCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Aviso visible de que nada se guarda todavía. */
function SimulationNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
      <div className="text-sm text-amber-900">
        <strong className="font-bold">Modo simulación.</strong> Puedes recorrer el registro
        completo, pero <strong>no se crea ninguna cuenta ni se guarda nada</strong>. Sirve para
        revisar la experiencia antes de conectarla.
      </div>
    </div>
  );
}

/** Pantalla final del registro. */
function RegistrationComplete({ restaurantName }: { restaurantName: string }) {
  const appLink = mainAppLink("/dueno-login");
  const status = statusById.en_revision;

  return (
    <div className="flex flex-col gap-6">
      <FormCard className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>

        <h2 className="mt-7 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          ¡Registro completado! 🎉
        </h2>

        {restaurantName && (
          <p className="mt-3 text-base text-muted">
            <span className="font-bold text-foreground">{restaurantName}</span> ha sido registrado
            correctamente en la plataforma.
          </p>
        )}

        <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
          <p className="text-sm leading-relaxed text-muted">
            Ahora nuestro equipo revisará la información proporcionada.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Una vez aprobado tu restaurante, podrás descargar la{" "}
            <strong className="text-foreground">aplicación para restaurantes</strong> y completar
            tu menú, productos, precios, horarios, promociones y demás información de tu negocio.
          </p>
        </div>

        {/* Estado actual */}
        <div
          className={`mx-auto mt-7 inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-bold ${status.tone}`}
        >
          <status.icon className="h-4 w-4" aria-hidden />
          {status.label}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {/* La app aún no está publicada: no se inventa un enlace de descarga. */}
          <CTAButton disabled className="cursor-not-allowed">
            <Download className="h-5 w-5" aria-hidden />
            Descargar app para restaurantes
          </CTAButton>
          {appLink && (
            <CTAButton href={appLink} variant="outline">
              <LogIn className="h-4 w-4" aria-hidden />
              Ir al inicio de sesión
            </CTAButton>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
          <Smartphone className="h-3.5 w-3.5" aria-hidden />
          Te avisaremos cuando tu cuenta esté lista para comenzar.
        </p>
      </FormCard>

      <StatusTimeline current="en_revision" />
    </div>
  );
}
