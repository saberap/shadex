export function jsonToFormData(
  data:
    | Record<string, unknown>
    | unknown[]
    | File
    | string
    | number
    | boolean
    | null
    | undefined,
  formData: FormData = new FormData(),
  parentKey?: string,
): FormData {
  if (data === null || data === undefined) return formData;

  if (typeof data !== "object" || data instanceof File) {
    if (parentKey)
      formData.append(parentKey, data instanceof File ? data : String(data));
    return formData;
  }

  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : String(index);
      jsonToFormData(
        value as
          | Record<string, unknown>
          | unknown[]
          | File
          | string
          | number
          | boolean
          | null
          | undefined,
        formData,
        key,
      );
    });
    return formData;
  }

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;
    jsonToFormData(
      value as
        | Record<string, unknown>
        | unknown[]
        | File
        | string
        | number
        | boolean
        | null
        | undefined,
      formData,
      fullKey,
    );
  });

  return formData;
}
