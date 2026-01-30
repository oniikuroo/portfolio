<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $toAddress = config('mail.from.address');
        if (! $toAddress || $toAddress === 'hello@example.com') {
            $toAddress = 'enriqueramallo04@gmail.com';
        }

        try {
            Mail::raw(
                "Nuevo mensaje de {$validated['name']} ({$validated['email']}):\n\n{$validated['message']}",
                function ($mail) use ($toAddress) {
                    $mail->to($toAddress)->subject('Nuevo contacto desde el portfolio');
                }
            );
        } catch (\Throwable $error) {
            Log::warning('Contact mail failed', ['error' => $error->getMessage()]);
        }

        return response()->json(['message' => 'Mensaje enviado correctamente.']);
    }
}
