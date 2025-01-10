export const validateEnvs = () => {
  const requiredEnvs = ['VITE_API_URL'];

  requiredEnvs.forEach((key) => {
    if (!import.meta.env[key]) {
      throw new Error(`Environment variable ${key} is not defined.`);
    }
  });
};
