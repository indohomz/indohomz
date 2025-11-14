import React, { useState } from 'react'
import { reportService } from '../../services/api'
import { HelpCircle, Loader2, Send, Square } from 'lucide-react'
import { useAiCall } from '../../hooks/useAiCall'

const BusinessQnA: React.FC = () => {
  const [q, setQ] = useState('')
  const ai = useAiCall<{ question: string; answer: string; generated_at: string}>({
    action: async () => {
      if (!q.trim()) throw new Error('Please enter a question')
      const res = await reportService.askQuestion(q.trim())
      return res.data as { question: string; answer: string; generated_at: string }
    },
    extractText: (r) => r.answer,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <HelpCircle className="h-5 w-5 text-primary-600 mr-2" /> Ask a business question
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Natural language Q&A across recent sales, inventory, and customers.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="input flex-1"
          placeholder="e.g., Which category drove the most revenue last week?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') ai.call()
          }}
        />
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" onClick={() => ai.call()} disabled={ai.loading}>
            {ai.loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Thinking...</> : <><Send className="h-4 w-4 mr-2" /> Ask</>}
          </button>
          {ai.loading && (
            <button className="btn btn-ghost" onClick={() => ai.cancel()} title="Cancel">
              <Square className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {(ai.data || ai.partial) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4" aria-live="polite">
          {ai.data && (
            <p className="text-xs text-gray-500 mb-2">Generated at {new Date(ai.data.generated_at).toLocaleString()}</p>
          )}
          <p className="whitespace-pre-line leading-6">{ai.data?.answer ?? ai.partial}</p>
        </div>
      )}
    </div>
  )
}

export default BusinessQnA
