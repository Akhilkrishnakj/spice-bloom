import React from 'react';

const CategoryForm = ({ handleSubmit, value, setValue, buttonLabel = "Create" }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        {buttonLabel} Category
      </h2>

      <input
        type="text"
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter category name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default CategoryForm;
