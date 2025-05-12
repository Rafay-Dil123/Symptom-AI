# views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import os

from .inference import run_inference


# def upload_input(request):
#     if request.method == 'POST' and request.FILES.get('file'):
#         try:
#             # Ensure the 'inputs/' folder exists
#             input_dir = os.path.join(default_storage.location, 'inputs')
#             os.makedirs(input_dir, exist_ok=True)
            
#             # Save uploaded file
#             uploaded_file = request.FILES['file']
#             file_path = default_storage.save(f"inputs/{uploaded_file.name}", uploaded_file)
#             full_path = os.path.join(default_storage.location, file_path)
            
#             # Run inference
#             segmentation, classification = run_inference(full_path)
            
#             # Clean up
#             default_storage.delete(file_path)
            
#             return JsonResponse({
#                 'status': 'success',
#                 'classification': classification,
#                 'segmentation_shape': str(segmentation.shape)
#             })
            
#         except Exception as e:
#             if 'file_path' in locals():
#                 default_storage.delete(file_path)
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

#     return JsonResponse({
#         'status': 'error',
#         'message': 'Invalid request - please upload a NIfTI file'
#     }, status=400)


@csrf_exempt
def upload_input(request):
    if request.method == 'POST':
        ed_file = request.FILES.get('ed_file')
        es_file = request.FILES.get('es_file')
        if not ed_file or not es_file:
            return JsonResponse({
                'status': 'error',
                'message': "Please upload both 'ed_file' and 'es_file'."
            }, status=400)

        input_dir = os.path.join(default_storage.location, 'inputs')
        os.makedirs(input_dir, exist_ok=True)

        try:
            # Save ED
            ed_path_rel = default_storage.save(f"inputs/{ed_file.name}", ed_file)
            ed_full = os.path.join(default_storage.location, ed_path_rel)
            # Save ES
            es_path_rel = default_storage.save(f"inputs/{es_file.name}", es_file)
            es_full = os.path.join(default_storage.location, es_path_rel)

            # Run your inference
            result = run_inference(ed_full, es_full)
            label = result.pop('label')
            masks = {
                'ed_mask_shape': result['ed_mask'].shape,
                'es_mask_shape': result['es_mask'].shape
            }
            # you can also return numeric values if you like:
            cardiac_params = {
                k: v for k, v in result.items() 
                if k.endswith('_ml') or k.endswith('_pct') or k == 'myo_mass_g'
            }

            # Clean up
            default_storage.delete(ed_path_rel)
            default_storage.delete(es_path_rel)

            return JsonResponse({
                'status': 'success',
                'classification': label,
                'masks': masks,
                'parameters': cardiac_params
            })

        except Exception as e:
            # ensure cleanup on error
            if 'ed_path_rel' in locals():
                default_storage.delete(ed_path_rel)
            if 'es_path_rel' in locals():
                default_storage.delete(es_path_rel)
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request — please POST with both `ed_file` and `es_file`.'
    }, status=400)

def welcome(request):


    return JsonResponse({
        'status': '200',
        'message': 'WELCOME TO syMPTOM sense ai'
    }, status=400)