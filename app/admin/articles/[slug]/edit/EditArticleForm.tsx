interface EditArticleFormProps {
  slug: string;
}

export default function EditArticleForm({ slug }: EditArticleFormProps) {
  // Component logic here
  return (
    <div>
      <h1>Edit Article: {slug}</h1>
      {/* Form elements go here */}
    </div>
  );
}
