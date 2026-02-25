import md5 from 'blueimp-md5';

export const getGravatarUrl = (email, size = 150) => {
    if (!email) return `https://gravatar.com/avatar/${size}`;

    // Gravatar требует обрезать пробелы и перевести в нижний регистр перед хешированием
    const hash = md5(email.trim().toLowerCase());

    // d=mp (Mystery Person) — дефолтная иконка, если у юзера нет аватара
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
};
