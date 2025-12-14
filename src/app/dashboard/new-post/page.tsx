'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit'); // If editing an existing draft
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'FREE',
    topic: 'TECHNOLOGY',
    coverImage: '',
    tags: '',
  });

  // Load existing draft if editing
  useEffect(() => {
    if (editId) {
      fetchDraft(editId);
    }
  }, [editId]);

  const fetchDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          type: data.type || 'FREE',
          topic: data.topic || 'TECHNOLOGY',
          coverImage: data.coverImage || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        });
        if (data.coverImage) {
          setImagePreview(data.coverImage);
        }
      } else {
        console.error('Failed to fetch draft, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Show loading state
      setIsUploading(true);

      try {
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          
          // Upload to Cloudinary
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64String }),
          });

          if (uploadResponse.ok) {
            const { url } = await uploadResponse.json();
            setImagePreview(url);
            setFormData(prev => ({ ...prev, coverImage: url }));
          } else {
            alert('Failed to upload image');
          }
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editId ? `/api/blog/${editId}` : '/api/blog';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          published: !isDraft,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(isDraft ? 'Draft saved successfully!' : 'Post published successfully!');
        router.push(isDraft ? '/dashboard' : `/blogs/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save post. Please try again.');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Page>
        <Container size="xl">
          <div className="py-12 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading draft...</p>
            </div>
          </div>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container size="xl">
        <div className="py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {editId ? 'Edit Draft' : 'Create New Post'}
                </h1>
                <p className="text-neutral-400">Share your thoughts with the world</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
              <label className="block text-sm font-bold text-white mb-3">
                Cover Image
              </label>
              
              {/* Image Upload */}
              {!imagePreview && !isUploading && (
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-neutral-800/30">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-neutral-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              )}

              {/* Loading State */}
              {isUploading && (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-primary-500 rounded-xl bg-neutral-800/30">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-3"></div>
                  <p className="text-sm text-neutral-400">Uploading image...</p>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && !isUploading && (
                <div className="relative h-64 rounded-xl overflow-hidden border border-neutral-700">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, coverImage: '' });
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
              <label className="block text-sm font-bold text-white mb-3">
                Title *
              </label>
              <Input
                type="text"
                placeholder="Enter your blog post title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-2xl font-bold"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
              <label className="block text-sm font-bold text-white mb-3">
                Excerpt *
              </label>
              <Textarea
                placeholder="Write a brief summary of your post (will be shown in blog cards)..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                required
              />
              <p className="mt-2 text-sm text-neutral-500">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            {/* Post Type and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
                <label className="block text-sm font-bold text-white mb-3">
                  Post Type *
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="FREE">Free</option>
                  <option value="PAID">Premium</option>
                </Select>
                <p className="mt-2 text-sm text-neutral-500">
                  Premium posts are only visible to paid subscribers
                </p>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
                <label className="block text-sm font-bold text-white mb-3">
                  Topic *
                </label>
                <Select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                >
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="HEALTH">Health</option>
                  <option value="LIFESTYLE">Lifestyle</option>
                  <option value="EDUCATION">Education</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                </Select>
                <p className="mt-2 text-sm text-neutral-500">
                  Choose the main topic for your post
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
              <label className="block text-sm font-bold text-white mb-3">
                Tags
              </label>
              <Input
                type="text"
                placeholder="React, Next.js, JavaScript (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <p className="mt-2 text-sm text-neutral-500">
                Separate tags with commas
              </p>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
              <label className="block text-sm font-bold text-white mb-4">
                Content *
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Start writing your amazing blog post..."
              />
              <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                <h3 className="text-sm font-bold text-white mb-2">💡 Editor Tips:</h3>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Use <kbd className="px-2 py-0.5 bg-neutral-700 rounded text-xs">Ctrl+B</kbd> for bold, <kbd className="px-2 py-0.5 bg-neutral-700 rounded text-xs">Ctrl+I</kbd> for italic</li>
                  <li>• Click the color picker to change text color</li>
                  <li>• Use the link icon to add hyperlinks</li>
                  <li>• Click the image icon to insert images</li>
                  <li>• Use headings (H1, H2, H3) to structure your content</li>
                </ul>
              </div>
            </div>

            {/* Preview Section */}
            {formData.content && (
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-700 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Content Preview
                </h3>
                <div 
                  className="blog-content text-neutral-300"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-neutral-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting || !formData.title || !formData.content}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save as Draft
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isSubmitting || !formData.title || !formData.excerpt || !formData.content}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </Page>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <Page>
        <Container size="xl">
          <div className="py-12 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading...</p>
            </div>
          </div>
        </Container>
      </Page>
    }>
      <NewPostForm />
    </Suspense>
  );
}
