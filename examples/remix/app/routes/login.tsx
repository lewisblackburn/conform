import { conform, useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
	remember: z.boolean().optional(),
});

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const submission = parse(formData, { schema });

	if (!submission.value) {
		return json(submission.reject());
	}

	return redirect(`/?value=${JSON.stringify(submission.value)}`);
}

export default function Login() {
	// Last submission returned by the server
	const lastResult = useActionData<typeof action>();
	const form = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parse(formData, { schema });
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
	});

	return (
		<Form method="post" {...conform.form(form)}>
			<div>
				<label>Email</label>
				<input
					className={!form.fields.email.valid ? 'error' : ''}
					{...conform.input(form.fields.email)}
				/>
				<div>{form.fields.email.errors}</div>
			</div>
			<div>
				<label>Password</label>
				<input
					className={!form.fields.password.valid ? 'error' : ''}
					{...conform.input(form.fields.password, { type: 'password' })}
				/>
				<div>{form.fields.password.errors}</div>
			</div>
			<label>
				<div>
					<span>Remember me</span>
					<input
						{...conform.input(form.fields.remember, { type: 'checkbox' })}
					/>
				</div>
			</label>
			<hr />
			<button>Login</button>
		</Form>
	);
}
