const loader = document.getElementById('loader');

export const showLoader = () => {
    loader.style.display = 'flex';
};

export const hideLoader = () => {
    loader.style.display = 'none';
};
