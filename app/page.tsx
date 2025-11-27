"use client";

import { useState, useEffect } from "react";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import NotesDisplay from "@/components/NotesDisplay";

interface Note {
  pulsos: number;
  valor: number;
  timestamp: string;
}

interface Session {
  totalAmount: number;
  notes: Note[];
  lastPulseTime: number | null;
}

interface WithdrawResponse {
  success: boolean;
  lnurl: string;
  id: string;
  amountBRL: number;
  amountSats: number;
  saldoRestante: number;
  url: string;
}

export default function Home() {
  const [session, setSession] = useState<Session>({
    totalAmount: 0,
    notes: [],
    lastPulseTime: null,
  });
  const [withdrawData, setWithdrawData] = useState<WithdrawResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Polling para atualizar a sessão a cada 1 segundo
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/session`);
        const data = await response.json();
        setSession(data);
      } catch (err) {
        console.error("Erro ao buscar sessão:", err);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 1000);

    return () => clearInterval(interval);
  }, [API_URL]);

  const handleWithdraw = async () => {
    if (session.totalAmount <= 0) {
      setError("Nenhum valor disponível para saque");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: session.totalAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar saque");
      }

      const data: WithdrawResponse = await response.json();
      setWithdrawData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/api/reset`, { method: "POST" });
      setWithdrawData(null);
      setError(null);
    } catch (err) {
      console.error("Erro ao resetar:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            ⚡ ATM Bitcoin Lightning
          </h1>
          <p className="text-xl text-white/90">
            Insira suas notas de Real e saque em Bitcoin
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {!withdrawData ? (
            <>
              {/* Display de Notas */}
              <NotesDisplay notes={session.notes} />

              {/* Total Amount Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-6 text-center">
                <p className="text-white/90 text-lg mb-2">Total Acumulado</p>
                <p className="text-6xl font-bold text-white mb-2">
                  R$ {session.totalAmount.toFixed(2)}
                </p>
                <p className="text-white/80 text-sm">
                  ≈ {Math.floor(session.totalAmount * 300)} sats
                </p>
              </div>

              {/* Status Message */}
              {session.totalAmount === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💵</div>
                  <p className="text-gray-600 text-lg">
                    Aguardando inserção de notas...
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Withdraw Button */}
              {session.totalAmount > 0 && (
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "⚡ Gerando QR Code..." : "⚡ SACAR AGORA"}
                </button>
              )}
            </>
          ) : (
            <>
              {/* QR Code Display */}
              <QRCodeDisplay withdrawData={withdrawData} />

              {/* New Transaction Button */}
              <button
                onClick={handleReset}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all mt-6"
              >
                🔄 Nova Transação
              </button>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-white/80 text-sm">
          <p>🔒 Saque único e seguro via Lightning Network</p>
          <p className="mt-1">Taxa atual: 1 BRL = 300 sats</p>
        </div>
      </div>
    </main>
  );
}
