"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATES, type Certificate } from "@/lib/certificates";

function CertTile({
  cert,
  onOpen,
}: {
  cert: Certificate;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open certificate: ${cert.event}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group glass relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_12px_32px_-12px_rgba(212,175,55,0.35)]"
    >
      {cert.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cert.image}
          alt={cert.event}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(212,175,55,0.06) 0px, rgba(212,175,55,0.06) 2px, transparent 2px, transparent 14px), radial-gradient(120% 100% at 20% 0%, rgba(200,30,58,0.14), transparent 55%)",
          }}
        />
      )}

      {!cert.image && (
        <span className="pointer-events-none absolute right-3 top-3 rounded border border-dashed border-[var(--glass-border)] px-2 py-0.5 font-[family-name:var(--font-data)] text-[10px] text-ink-faint">
          image pending
        </span>
      )}

      <div className="relative z-10 bg-gradient-to-t from-void/90 via-void/40 to-transparent px-1 pb-1 pt-8">
        <div className="font-[family-name:var(--font-data)] text-[10px] text-brass">
          {cert.year}
        </div>
        <div className="font-[family-name:var(--font-display)] text-base leading-tight text-ink sm:text-lg">
          {cert.event}
        </div>
        <div className="mt-0.5 text-xs text-ink-dim">{cert.result}</div>
      </div>
    </motion.button>
  );
}

function CertZoomModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.event} certificate`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-void/90 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-2xl overflow-hidden rounded-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute right-4 top-4 z-10 font-[family-name:var(--font-data)] text-sm text-ink-dim hover:text-brass"
        >
          close ✕
        </button>

        <div className="relative aspect-[4/3] w-full">
          {cert.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cert.image} alt={cert.event} className="h-full w-full object-contain bg-surface-2" />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-center justify-center"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(212,175,55,0.07) 0px, rgba(212,175,55,0.07) 2px, transparent 2px, transparent 16px), radial-gradient(120% 100% at 20% 0%, rgba(200,30,58,0.16), transparent 55%)",
              }}
            >
              <span className="rounded border border-dashed border-[var(--glass-border)] px-3 py-1 font-[family-name:var(--font-data)] text-xs text-ink-faint">
                certificate image pending
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="font-[family-name:var(--font-data)] text-xs text-brass">{cert.year}</div>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">{cert.event}</h3>
          <p className="mt-1 text-sm text-ink-dim">{cert.result}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HackathonWall() {
  const [openCert, setOpenCert] = useState<Certificate | null>(null);

  return (
    <section className="relative px-6 py-24 sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-[family-name:var(--font-data)] text-xs text-brass">
          HACKATHONS
        </span>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
          The certificate wall
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-dim">
          {CERTIFICATES.length} shown here — click any tile to zoom in.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {CERTIFICATES.map((cert) => (
            <CertTile key={cert.id} cert={cert} onOpen={() => setOpenCert(cert)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openCert && <CertZoomModal cert={openCert} onClose={() => setOpenCert(null)} />}
      </AnimatePresence>
    </section>
  );
}
