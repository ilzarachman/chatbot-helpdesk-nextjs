import React, { useState } from 'react';
// import { Button, Input, Textarea } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthenticationContext } from '@/lib/context-provider';
import { fetchAPI } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast"


interface FeedbackFormProps {
    bot_answer: string;
    prompt: string;
    onClose: () => void;
}

// Define the Zod schema
const feedbackSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    feedback: z.string().min(10, 'Feedback must be at least 10 characters long'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm: React.FC<FeedbackFormProps> = ({ bot_answer, prompt, onClose }) => {
    const { authenticated: isAuthenticated, authenticatedName, authenticatedEmail } = useContext(AuthenticationContext);
    const { toast } = useToast()

    const [formData, setFormData] = useState<FeedbackFormData>({
        name: isAuthenticated.value ? authenticatedName : '',
        email: isAuthenticated.value ? authenticatedEmail : '',
        feedback: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    function sendAuthenticatedFeedback(prompt: string, bot_answer: string, message: string) {
        fetchAPI('/question/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                bot_answer: bot_answer,
                message: message
            }),
            credentials: 'include',
        }).then((res) => {
            if (!res.ok) {
                toast({
                    description: "Something went wrong. Please try again later.",
                    title: "Error",
                    variant: "destructive",
                })
                return;
            }

            toast({
                description: "Thank you for your feedback!",
                title: "Success",
                variant: "default",
            })
            onClose();
        }).catch((error) => {
            toast({
                description: "Something went wrong. Please try again later.",
                title: "Error",
                variant: "destructive",
            })
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    function sendPublicFeedback(prompt: string, bot_answer: string, message: string, questioner_email: string, questioner_name: string) {
        fetchAPI('/question/public/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                bot_answer: bot_answer,
                message: message,
                questioner_email: questioner_email,
                questioner_name: questioner_name
            }),
            credentials: 'include',
        }).then((res) => {
            if (!res.ok) {
                toast({
                    description: "Something went wrong. Please try again later.",
                    title: "Error",
                    variant: "destructive",
                })
                return;
            }

            toast({
                description: "Thank you for your feedback!",
                title: "Success",
                variant: "default",
            })
            onClose();
        }).catch(() => {
            toast({
                description: "Something went wrong. Please try again later.",
                title: "Error",
                variant: "destructive",
            })
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data using Zod schema
        const result = feedbackSchema.safeParse(formData);

        if (!result.success) {
            // Extract errors and set them in state
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
                if (error.path[0]) {
                    formattedErrors[error.path[0] as string] = error.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        setSubmissionError(null);

        if (isAuthenticated.value) {
            sendAuthenticatedFeedback(prompt, bot_answer, formData.feedback);
        } else {
            sendPublicFeedback(prompt, bot_answer, formData.feedback, formData.email, formData.name);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isAuthenticated.value && (
                <>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                </>
            )}
            <div>
                <label htmlFor="feedback" className="block text-sm font-medium">
                    Feedback
                </label>
                <Textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full"
                />
                {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
            </div>
            <Button type="submit" className="mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
};

export default FeedbackForm;