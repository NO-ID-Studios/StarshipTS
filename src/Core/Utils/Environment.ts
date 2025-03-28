export function envGet<ValueType>(key: string, defaultValue: ValueType): ValueType {
	const value = process.env[ key ] as ValueType;

	return value ?? defaultValue;
}
