"use client";

import { useEffect, useState } from "react";

interface WithdrawResponse {
  success: boolean;
  lnurl: string;
  id: string;
  amountBRL: number;
  amountSats: number;
  saldoRestante: number;
  url: string;
}

interface QRCodeDisplayProps {
  withdrawData: WithdrawResponse;
}

export default function QRCodeDisplay({ withdrawData }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Gera QR code usando API pública
    const generateQR = async () => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        withdrawData.lnurl.toUpperCase()
      )}`;
      setQrCodeUrl(qrUrl);
    };

    generateQR();
  }, [withdrawData]);

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
          ✅ QR Code Gerado!
        </div>
      </div>

      {/* Valor do Saque */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6">
        <p className="text-white/90 text-sm mb-1">Valor do Saque</p>
        <p className="text-4xl font-bold text-white mb-1">
          R$ {withdrawData.amountBRL.toFixed(2)}
        </p>
        <p className="text-white/80 text-lg">
          {withdrawData.amountSats} satoshis
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-2xl shadow-inner mb-6">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="QR Code Lightning"
            className="mx-auto rounded-xl"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-[400px] h-[400px] bg-gray-200 animate-pulse rounded-xl mx-auto" />
        )}
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-lg text-blue-900 mb-3">📱 Como Sacar</h3>
        <ol className="text-left text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>
              Abra sua carteira Lightning (Phoenix, Muun, Wallet of Satoshi,
              etc)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Escaneie o QR Code acima</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>
              Confirme o recebimento dos {withdrawData.amountSats} sats
            </span>
          </li>
        </ol>
      </div>

      {/* LNURL para copiar */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Ou copie o código LNURL:</p>
        <div className="bg-gray-100 p-3 rounded-lg">
          <code className="text-xs break-all text-gray-700">
            {withdrawData.lnurl}
          </code>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(withdrawData.lnurl);
            alert("LNURL copiado!");
          }}
          className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          📋 Copiar LNURL
        </button>
      </div>

      {/* Saldo Restante */}
      {withdrawData.saldoRestante > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800">
            💰 Saldo restante:{" "}
            <span className="font-bold">
              R$ {withdrawData.saldoRestante.toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* Aviso */}
      <div className="mt-6 text-sm text-gray-500">
        <p>⚠️ Este QR code é de uso único e expira em breve</p>
      </div>
    </div>
  );
}
