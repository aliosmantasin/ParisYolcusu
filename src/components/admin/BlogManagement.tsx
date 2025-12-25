"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Save, Trash2, Edit2, Upload, X, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  category: string;
  image?: { id: string; url: string } | null;
  author?: string | null;
  isPublished: boolean;
  isActive: boolean;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const categoryOptions = [
  { value: 'PARIS_TRANSFER', label: 'Paris Transfer' },
  { value: 'PARIS_TURLARI', label: 'Paris Turları' },
  { value: 'PARIS_REHBERI', label: 'Paris Rehberi' },
];

// Blog görsel kategorileri (küçük harf, klasör adları)
const blogImageCategories = [
  'paris-transfer',
  'paris-turlari',
  'paris-rehberi',
];

export function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [tempSelectedImageId, setTempSelectedImageId] = useState<string | null>(null);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<{ id: string; url: string; bucket: string }[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImageCategory, setSelectedImageCategory] = useState<string>('paris-transfer');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'PARIS_TRANSFER' as string,
    imageId: '',
    author: '',
    isPublished: false,
    isActive: true,
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/blogs', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Bloglar getirilemedi');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Bloglar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCarouselVisibility = useCallback(async () => {
    try {
      const response = await fetch('/api/settings?key=blog_carousel_visible', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setIsCarouselVisible(data === null || data.value === 'true');
      }
    } catch (error) {
      console.error('Carousel visibility fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCarouselVisibility();
  }, [fetchBlogs, fetchCarouselVisibility]);

  const handleToggleCarouselVisibility = async () => {
    try {
      setIsUpdatingVisibility(true);
      const newValue = !isCarouselVisible;
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          key: 'blog_carousel_visible',
          value: String(newValue),
        }),
      });

      if (response.ok) {
        setIsCarouselVisible(newValue);
        alert(newValue ? 'Blog carousel gösteriliyor' : 'Blog carousel gizlendi');
      } else {
        throw new Error('Ayar güncellenemedi');
      }
    } catch (error) {
      console.error('Carousel visibility update error:', error);
      alert('Ayar güncellenemedi');
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const fetchImages = useCallback(async (category?: string) => {
    try {
      setIsLoadingImages(true);
      const url = category 
        ? `/api/images?bucket=blog&category=${category}`
        : '/api/images?bucket=blog';
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // Eğer kategori belirtilmişse, o kategori klasöründeki görselleri filtrele
        if (category) {
          const filtered = data.filter((img: { id: string; url: string; bucket: string }) => 
            img.bucket === 'blog' && img.url.includes(`/${category}/`)
          );
          setAvailableImages(filtered);
        } else {
          setAvailableImages(data.filter((img: { id: string; url: string; bucket: string }) => img.bucket === 'blog'));
        }
      }
    } catch (error) {
      console.error('Images fetch error:', error);
      setAvailableImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  // Modal açıldığında ve kategori değiştiğinde görselleri yükle
  useEffect(() => {
    if (isImageGalleryOpen) {
      fetchImages(selectedImageCategory);
    }
  }, [isImageGalleryOpen, selectedImageCategory, fetchImages]);

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Lütfen bir veya daha fazla dosya seçin');
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadFormData = new FormData();
      selectedFiles.forEach(file => {
        uploadFormData.append('images', file);
      });
      uploadFormData.append('bucketName', 'blog');
      uploadFormData.append('category', selectedImageCategory);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Bilinmeyen hata' }));
        throw new Error(errorData.message || 'Görsel yüklenemedi');
      }

      const imageData = await response.json();
      // Yüklenen görselleri listeye ekle
      setAvailableImages(prev => [...imageData, ...prev]);
      setSelectedFiles([]);
      alert(`${imageData.length} görsel başarıyla yüklendi`);
      // Görselleri yeniden yükle
      fetchImages(selectedImageCategory);
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error instanceof Error ? error.message : 'Görsel yüklenirken bir hata oluştu');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId);
    setFormData(prev => ({ ...prev, imageId }));
    setIsImageGalleryOpen(false);
  };

  const handleOpenImageGallery = () => {
    setTempSelectedImageId(selectedImageId);
    // Form'daki kategoriye göre görselleri yükle
    const categoryMap: Record<string, string> = {
      'PARIS_TRANSFER': 'paris-transfer',
      'PARIS_TURLARI': 'paris-turlari',
      'PARIS_REHBERI': 'paris-rehberi',
    };
    const imageCategory = categoryMap[formData.category] || 'paris-transfer';
    setSelectedImageCategory(imageCategory);
    fetchImages(imageCategory);
    setIsImageGalleryOpen(true);
  };

  const handleOpenForm = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setSelectedImageId(blog.image?.id || null);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        content: blog.content,
        category: blog.category,
        imageId: blog.image?.id || '',
        author: blog.author || '',
        isPublished: blog.isPublished,
        isActive: blog.isActive,
      });
    } else {
      setEditingBlog(null);
      setSelectedImageId(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'PARIS_TRANSFER',
        imageId: '',
        author: '',
        isPublished: false,
        isActive: true,
      });
    }
    setIsFormOpen(true);
    fetchImages();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog.id}`
        : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      // Boş string'leri null'a çevir (validation için)
      const payload = {
        ...formData,
        excerpt: formData.excerpt || undefined,
        imageId: formData.imageId || undefined,
        author: formData.author || undefined,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Blog kaydedilemedi' }));
        const errorMessage = errorData.errors 
          ? errorData.errors.map((e: { path: string | string[]; message: string }) => {
              const path = Array.isArray(e.path) ? e.path.join('.') : e.path;
              return `${path}: ${e.message}`;
            }).join(', ')
          : errorData.message || 'Blog kaydedilemedi';
        throw new Error(errorMessage);
      }
      
      alert('Blog başarıyla kaydedildi!');
      setIsFormOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error('Blog kaydedilemedi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Blog kaydedilemedi';
      alert(`Hata: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blogu silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Blog silinemedi');
      fetchBlogs();
    } catch (error) {
      console.error('Blog silinemedi:', error);
      alert('Blog silinemedi');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Blog Görselleri Yükleme Alanı */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Blog Görselleri Yükle</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="image-category-select">Kategori Klasörü</Label>
            <select
              id="image-category-select"
              value={selectedImageCategory}
              onChange={(e) => setSelectedImageCategory(e.target.value)}
              className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-1"
            >
              {blogImageCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Görseller &quot;blog/{selectedImageCategory}/&quot; klasörüne yüklenecek
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
              accept="image/*"
              className="max-w-xs"
            />
            <Button onClick={handleImageUpload} disabled={isUploadingImage || selectedFiles.length === 0}>
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Yükle
                </>
              )}
            </Button>
          </div>
          {selectedFiles.length > 0 && (
            <div className="text-sm text-gray-500">
              Seçilen dosyalar: {selectedFiles.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Blog Yazıları</h2>
        <div className="flex gap-2">
          <Button
            variant={isCarouselVisible ? "default" : "outline"}
            onClick={handleToggleCarouselVisibility}
            disabled={isUpdatingVisibility}
          >
            {isUpdatingVisibility ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              <>
                {isCarouselVisible ? '✓ Carousel Görünür' : 'Carousel Gizli'}
              </>
            )}
          </Button>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Blog
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Başlık</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Durum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Görüntülenme</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{blog.title}</td>
                <td className="px-4 py-3">{categoryOptions.find(c => c.value === blog.category)?.label || blog.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {blog.isPublished ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-4 py-3">{blog.views}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(blog)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Blog Düzenle' : 'Yeni Blog'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="excerpt">Özet</Label>
              <Input
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="content">İçerik</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-64 p-4 border rounded-md resize-none"
                placeholder="Blog içeriğini buraya yazın..."
              />
            </div>
            <div>
              <Label>Kapak Görseli</Label>
              <div className="mt-2 space-y-2">
                {selectedImageId && availableImages.find(img => img.id === selectedImageId) ? (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={availableImages.find(img => img.id === selectedImageId)!.url}
                      alt="Selected"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedImageId(null);
                        setFormData(prev => ({ ...prev, imageId: '' }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Görsel seçilmedi</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenImageGallery}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Görsel Seç
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <span>Yayınla</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Aktif</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
        <DialogContent className="max-w-6xl max-h-[85vh] p-0 flex flex-col">
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle>Görsel Seç</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Label htmlFor="gallery-category-select" className="text-sm font-medium text-gray-700">
                Kategori Klasörü
              </Label>
              <select
                id="gallery-category-select"
                value={selectedImageCategory}
                onChange={(e) => {
                  setSelectedImageCategory(e.target.value);
                  fetchImages(e.target.value);
                }}
                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-white mt-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {blogImageCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                &quot;blog/{selectedImageCategory}/&quot; klasöründeki görseller gösteriliyor
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : availableImages.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Henüz görsel yüklenmemiş</p>
                <p className="text-gray-400 text-sm mt-2">
                  Bu kategori için görsel yüklemek için üstteki &quot;Blog Görselleri Yükle&quot; bölümünü kullanın
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableImages.map((image) => {
                  const isSelected = tempSelectedImageId === image.id;
                  return (
                    <div
                      key={image.id}
                      className={`relative aspect-square group rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-4 border-blue-600 ring-4 ring-blue-200 ring-offset-2 shadow-xl scale-[0.98]'
                          : 'border-2 border-gray-200 hover:border-gray-400 hover:shadow-md'
                      }`}
                      onClick={() => setTempSelectedImageId(image.id)}
                    >
                      {/* Seçim Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/30 z-10 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Checkbox - Sağ alt köşe */}
                      <div
                        className={`absolute bottom-2 right-2 z-20 rounded-md p-1.5 transition-all shadow-lg ${
                          isSelected
                            ? 'bg-blue-600 text-white border-2 border-white'
                            : 'bg-white/95 text-gray-400 hover:bg-white hover:text-gray-600 border border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempSelectedImageId(isSelected ? null : image.id);
                        }}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </div>

                      {/* Görsel */}
                      <div className="w-full h-full bg-gray-100">
                        <Image
                          src={image.url}
                          alt="Gallery"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>

                      {/* Hover Overlay - Görsel bilgisi */}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="text-white text-center px-2">
                          <p className="text-xs font-medium truncate max-w-[120px]">
                            {image.url.split('/').pop()?.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t p-6">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-600">
                {tempSelectedImageId ? (
                  <span className="text-blue-600 font-medium">1 görsel seçildi</span>
                ) : (
                  <span>Görsel seçin</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsImageGalleryOpen(false)}>
                  İptal
                </Button>
                <Button
                  onClick={() => {
                    if (tempSelectedImageId) {
                      handleImageSelect(tempSelectedImageId);
                    }
                  }}
                  disabled={!tempSelectedImageId}
                  className="min-w-[100px]"
                >
                  Seç
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

