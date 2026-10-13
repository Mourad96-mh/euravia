/**
 * The last check before a form is sent (briefing of 2026-09-26: nothing leaves until every
 * required field is filled in).
 *
 * The browser already refuses an empty required field, but it counts a field holding only
 * spaces as filled. So those are emptied here and the form is validated again: the browser
 * then points at the first one with its own message, in the reader's language.
 */
export function requiredFieldsFilled(form: HTMLFormElement): boolean {
  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[required]:not([type="file"]):not([type="checkbox"]):not([type="radio"]), textarea[required]'
    )
    .forEach((field) => {
      if (field.value.trim() === '') field.value = '';
    });
  return form.reportValidity();
}
