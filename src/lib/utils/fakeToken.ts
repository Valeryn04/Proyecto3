//Simular token
//Cada token tiene un paydload con name, rol y exp (expira en 1 hora)

function createFakeToken(name: String, role: String) {
  const header = btoa(JSON.stringify({ alg: "HS256", type: "JWT" }));
  const paydload = btoa(
    JSON.stringify({
      name,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,

    })
  );
  const signature = "fakeSignature";
  return `${header}.${paydload}.${signature}`;
}
export const fakeTokens = {
  admin: createFakeToken("Vale", "admin"),
  medico: createFakeToken("Carlos", "medico"),
  superadmin: createFakeToken("Sara", "superadmin"),
  paciente: createFakeToken("Juan", "paciente"),
};
