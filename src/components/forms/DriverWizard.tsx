"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, FlaskConical, LogIn, RotateCcw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CTAButton } from "@/components/ui/Button";
import { FormCard } from "@/components/forms/FormShell";
import { Stepper, type StepMeta } from "@/components/forms/wizard/Stepper";
import { DriverStepPersonal } from "@/components/forms/wizard/DriverStepPersonal";
import { DriverStepLocation } from "@/components/forms/wizard/DriverStepLocation";
import { DriverStepVehicle } from "@/components/forms/wizard/DriverStepVehicle";
import { DriverStepId } from "@/components/forms/wizard/DriverStepId";
import { DriverStepPhoto } from "@/components/forms/wizard/DriverStepPhoto";
import { DriverStepConfirm } from "@/components/forms/wizard/DriverStepConfirm";
import { DriverStatusTimeline } from "@/components/forms/wizard/DriverStatusTimeline";
import {
  approvalDelaySeconds,
  approvalMode,
  driverStatusById,
  initialDriverStatus,
} from "@/data/driverRegistration";
import type { DriverStatus } from "@/data/driverRegistration";
import { mainAppLink } from "@/lib/supabase";
import type { PickedImage } from "@/lib/restaurantRegistration";
import {
  clearDriverDraft,
  loadDriverDraft,
  saveDriverDraft,
  type DriverStep1,
  type DriverStep2,
  type DriverStep3,
  type DriverStep4,
} from "@/lib/driverRegistration";

/* ==========================================================================
   MODO SIMULACIÓN

   En `true` el asistente NO escribe en Supabase: valida todo, muestra el
   resumen y simula el envío.

   Para conectarlo de verdad hacen falta: columnas nuevas en la tabla de
   repartidores (ciudad, estado, vehículo, identificación, estado de cuenta),
   un bucket PRIVADO para la identificación y el comprobante de domicilio,
   otro público para la foto de perfil, y comprobación de duplicados.
   Después basta con poner esta constante en `false`.
   ========================================================================== */
const SIMULATION = true;

const steps: StepMeta[] = [
  { id: 1, label: "Datos personales", short: "Datos" },
  { id: 2, label: "Ubicación", short: "Ubicación" },
  { id: 3, label: "Medio de transporte", short: "Transporte" },
  { id: 4, label: "Identificación oficial", short: "Identificación" },
  { id: 5, label: "Foto de perfil", short: "Foto" },
  { id: 6, label: "Revisa y confirma", short: "Confirmar" },
];

export function DriverWizard() {
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [step1, setStep1] = useState<DriverStep1 | null>(null);
  const [step2, setStep2] = useState<DriverStep2 | null>(null);
  const [step3, setStep3] = useState<DriverStep3 | null>(null);
  const [step4, setStep4] = useState<DriverStep4 | null>(null);
  const [photo, setPhoto] = useState<PickedImage | null>(null);
  const [idFront, setIdFront] = useState<PickedImage | null>(null);
  const [idBack, setIdBack] = useState<PickedImage | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<PickedImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [restored, setRestored] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  /** Recupera el avance guardado (nunca la contraseña ni la foto). */
  useEffect(() => {
    const draft = loadDriverDraft();
    if (!draft) return;
    if (draft.step1) setStep1({ ...(draft.step1 as DriverStep1), password: "", confirm: "" });
    if (draft.step2) setStep2(draft.step2 as DriverStep2);
    if (draft.step3) setStep3(draft.step3 as DriverStep3);
    if (draft.step4) setStep4(draft.step4 as DriverStep4);
    setFurthest(Math.max(draft.step ?? 1, 1));
    setRestored(true);
  }, []);

  useEffect(() => {
    if (step > 1) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const persist = (
    nextStep: number,
    data?: Partial<{ s1: DriverStep1; s2: DriverStep2; s3: DriverStep3; s4: DriverStep4 }>,
  ) => {
    const s1 = data?.s1 ?? step1;
    saveDriverDraft({
      step: nextStep,
      // La contraseña nunca sale del formulario.
      step1: s1
        ? {
            firstName: s1.firstName,
            lastName: s1.lastName,
            phone: s1.phone,
            email: s1.email,
          }
        : {},
      step2: (data?.s2 ?? step2) ?? {},
      step3: (data?.s3 ?? step3) ?? {},
      step4: (data?.s4 ?? step4) ?? {},
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
      await new Promise((r) => setTimeout(r, 1400));
      setSubmitting(false);
      setDone(true);
      clearDriverDraft();
      return;
    }

    setSubmitting(false);
    setError("El envío real todavía no está habilitado en este entorno.");
  };

  if (done) {
    return <DriverRegistrationComplete firstName={step1?.firstName ?? ""} />;
  }

  return (
    <div ref={topRef} className="flex flex-col gap-6">
      {SIMULATION && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
          <div className="text-sm text-amber-900">
            <strong className="font-bold">Modo simulación.</strong> Puedes recorrer el registro
            completo, pero <strong>no se crea ninguna cuenta ni se guarda nada</strong>. Sirve para
            revisar la experiencia antes de conectarla.
          </div>
        </div>
      )}

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
              clearDriverDraft();
              setRestored(false);
              setStep1(null);
              setStep2(null);
              setStep3(null);
              setStep4(null);
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
              <DriverStepPersonal
                defaults={step1 ?? {}}
                onNext={(values) => {
                  setStep1(values);
                  persist(2, { s1: values });
                  advance(2);
                }}
              />
            )}

            {step === 2 && (
              <DriverStepLocation
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
              <DriverStepVehicle
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
              <DriverStepId
                defaults={step4 ?? {}}
                front={idFront}
                back={idBack}
                proof={proofOfAddress}
                onFront={setIdFront}
                onBack_={setIdBack}
                onProof={setProofOfAddress}
                onBack={() => setStep(3)}
                onNext={(values) => {
                  setStep4(values);
                  persist(5, { s4: values });
                  advance(5);
                }}
              />
            )}

            {step === 5 && (
              <DriverStepPhoto
                photo={photo}
                onPhoto={setPhoto}
                onBack={() => setStep(4)}
                onNext={() => advance(6)}
              />
            )}

            {step === 6 && step1 && step2 && step3 && step4 && (
              <DriverStepConfirm
                step1={step1}
                step2={step2}
                step3={step3}
                step4={step4}
                photo={photo}
                idFront={idFront}
                idBack={idBack}
                proofOfAddress={proofOfAddress}
                onEdit={setStep}
                onBack={() => setStep(5)}
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

/** Pantalla final del registro de repartidor. */
function DriverRegistrationComplete({ firstName }: { firstName: string }) {
  const appLink = mainAppLink("/moto");

  const [status, setStatus] = useState<DriverStatus>(initialDriverStatus);
  const [secondsLeft, setSecondsLeft] = useState(
    approvalMode === "diferida" ? approvalDelaySeconds : 0,
  );

  /*
   * Aprobación diferida: espera puramente visual. Nadie revisa nada durante
   * ese tiempo y el estado real no depende de este temporizador.
   */
  useEffect(() => {
    if (approvalMode !== "diferida" || status !== "en_revision") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setStatus("aprobado");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const badge = driverStatusById[status];
  const approved = status === "aprobado";

  return (
    <div className="flex flex-col gap-6">
      <FormCard className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>

        <h2 className="mt-7 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          ¡Registro completado! 🎉
        </h2>

        <p className="mt-3 text-base text-muted">
          {firstName ? `${firstName}, tu` : "Tu"} cuenta de repartidor ha sido creada
          correctamente.
        </p>

        <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
          <p className="text-sm leading-relaxed text-muted">
            {approved
              ? "Tu cuenta ya está aprobada. El siguiente paso es descargar nuestra "
              : "Mientras revisamos tus datos puedes ir descargando nuestra "}
            <strong className="text-foreground">aplicación para repartidores</strong>.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Desde la aplicación podrás completar tu perfil, consultar tu estado de cuenta,
            conectarte para recibir pedidos y administrar tus entregas.
          </p>
        </div>

        <div
          className={`mx-auto mt-7 inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-bold ${badge.tone}`}
        >
          <badge.icon className="h-4 w-4" aria-hidden />
          {badge.label}
          {approvalMode === "diferida" && !approved && secondsLeft > 0 && (
            <span className="font-mono tabular-nums">{secondsLeft}s</span>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {/* La app aún no está publicada: no se inventa un enlace de descarga. */}
          <CTAButton disabled className="cursor-not-allowed">
            <Download className="h-5 w-5" aria-hidden />
            Descargar app para repartidores
          </CTAButton>
          {appLink && (
            <CTAButton href={appLink} variant="outline">
              <LogIn className="h-4 w-4" aria-hidden />
              Ya tengo la aplicación
            </CTAButton>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
          <Smartphone className="h-3.5 w-3.5" aria-hidden />
          {approved
            ? "Entra con tu correo y contraseña para empezar a recibir pedidos."
            : "Te avisaremos cuando tu cuenta esté lista para comenzar."}
        </p>
      </FormCard>

      <DriverStatusTimeline current={status} />
    </div>
  );
}
