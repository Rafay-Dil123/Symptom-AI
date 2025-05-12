# import torch
# import nibabel as nib
# import numpy as np
# import joblib
# from monai.networks.nets import SwinUNETR
# from skimage.transform import resize
# import os
# import sys
# from pathlib import Path

# # Add the project root to Python path
# project_root = str(Path(__file__).parent.parent)
# sys.path.append(project_root)

# class CardiacAnalyzer:
#     def __init__(self):
#         self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#         self.BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#         self.load_models()
    
#     def load_models(self):
#         """Load both segmentation and classification models"""
#         # Segmentation model
#         self.swin_model = SwinUNETR(
#             img_size=(64, 64, 64),
#             in_channels=1,
#             out_channels=4,
#             feature_size=48,
#             use_checkpoint=True
#         )
#         swin_path = os.path.join(self.BASE_DIR, "swin_rf_app", "client2_model.pth")
#         self.swin_model.load_state_dict(torch.load(swin_path, map_location=self.device))
#         self.swin_model.to(self.device)
#         self.swin_model.eval()
        
#         # Classification model with robust loading
#         rf_path = os.path.join(self.BASE_DIR, "swin_rf_app", "global_model.pkl")
        
#         # Method 1: Try direct load first
#         try:
#             self.rf_model = joblib.load(rf_path)
#             return
#         except Exception as e:
#             print(f"First load attempt failed: {str(e)}")
        
#         # Method 2: Create dummy module if needed
#         try:
#             import types
#             if 'utils' not in sys.modules:
#                 sys.modules['utils'] = types.ModuleType('utils')
#                 from swin_rf_app.utils import RandomForest
#                 sys.modules['utils'].RandomForest = RandomForest
            
#             self.rf_model = joblib.load(rf_path)
#             return
#         except Exception as e:
#             print(f"Second load attempt failed: {str(e)}")
        
#         # Method 3: Fallback to standard RandomForest
#         try:
#             from sklearn.ensemble import RandomForestClassifier
#             self.rf_model = RandomForestClassifier()
#             print("WARNING: Using dummy RandomForest - predictions may be inaccurate")
#         except Exception as e:
#             raise RuntimeError(f"Failed to load any RandomForest model: {str(e)}")

#     # [Keep all other methods unchanged]
    
#     def preprocess_image(self, nifti_path):
#         """Load and preprocess NIfTI image"""
#         img = nib.load(nifti_path)
#         data = img.get_fdata()
        
#         # Handle 4D data (select first volume if time series)
#         if data.ndim == 4:
#             data = data[..., 0]
        
#         # Normalize and resize
#         data = (data - np.min(data)) / (np.max(data) - np.min(data) + 1e-8)
#         data = resize(data, (64, 64, 64), order=1, preserve_range=True, anti_aliasing=True)
#         return data.astype(np.float32)
    
#     def run_inference(self, nifti_path):
#         """Main inference function"""
#         try:
#             # Preprocess
#             image_data = self.preprocess_image(nifti_path)
            
#             # Get segmentation
#             with torch.no_grad():
#                 tensor = torch.from_numpy(image_data).float()
#                 tensor = tensor.unsqueeze(0).unsqueeze(0).to(self.device)
#                 output = self.swin_model(tensor)
#                 segmentation = torch.argmax(output, dim=1).squeeze().cpu().numpy()
            
#             # Get classification features
#             features = torch.mean(output, dim=(2, 3, 4)).cpu().numpy().reshape(1, -1)
            
#             # Predict class
#             prediction = self.rf_model.predict(features)[0]
#             classification = 'HCM' if prediction == 1 else 'Non-HCM'
            
#             return segmentation, classification
            
#         except Exception as e:
#             raise RuntimeError(f"Inference error: {str(e)}")

# # Create analyzer instance
# analyzer = CardiacAnalyzer()

# def run_inference(file_path):
#     return analyzer.run_inference(file_path)




import os
import sys
import torch
import nibabel as nib
import numpy as np
import joblib
from monai.networks.nets import SwinUNETR
from scipy.ndimage import zoom
from pathlib import Path

# Add project root to path
project_root = str(Path(__file__).parent.parent)
sys.path.append(project_root)

class CardiacAnalyzer:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.BASE_DIR = Path(__file__).resolve().parent
        self.TARGET_SHAPE = (64, 64, 64)
        self.load_models()

    def load_models(self):
        """Load segmentation and classification models"""
        # Segmentation model
        self.swin_model = SwinUNETR(
            img_size=self.TARGET_SHAPE,
            in_channels=1,
            out_channels=4,
            feature_size=48,
            use_checkpoint=False
        )
        swin_path = os.path.join(self.BASE_DIR, "client2_model.pth")
        self.swin_model.load_state_dict(torch.load(swin_path, map_location=self.device))
        self.swin_model.to(self.device).eval()

        # Classification model
        rf_path = os.path.join(self.BASE_DIR, "global_model.pkl")
        # Method 1: Try direct load first
        try:
            self.rf_model = joblib.load(rf_path)
            return
        except Exception as e:
            print(f"First load attempt failed: {str(e)}")
        
        # Method 2: Create dummy module if needed
        try:
            import types
            if 'utils' not in sys.modules:
                print("lsdfknj")
                sys.modules['utils'] = types.ModuleType('utils')
                from swin_rf_app.utils import RandomForest
                sys.modules['utils'].RandomForest = RandomForest
            
            self.rf_model = joblib.load(rf_path)
            return
        except Exception as e:
            print(f"Second load attempt failed: {str(e)}")
        
        # Method 3: Fallback to standard RandomForest
        try:
            from sklearn.ensemble import RandomForestClassifier
            self.rf_model = RandomForestClassifier()
            print("WARNING: Using dummy RandomForest - predictions may be inaccurate")
        except Exception as e:
            raise RuntimeError(f"Failed to load any RandomForest model: {str(e)}")


    def _preprocess(self, nifti_path):
        """
        Load, resample, normalize a NIfTI file. Return tensor and voxel volume (ml).
        """
        img = nib.load(nifti_path)
        data = img.get_fdata()
        zooms = img.header.get_zooms()[:3]
        voxel_ml = (zooms[0] * zooms[1] * zooms[2]) / 1000.0

        # If 4D, take first timepoint
        if data.ndim == 4:
            data = data[..., 0]

        # Resample
        factors = [t / s for t, s in zip(self.TARGET_SHAPE, data.shape)]
        data = zoom(data, factors, order=1)

        # Normalize
        minv, maxv = data.min(), data.max()
        data = ((data - minv) / (maxv - minv + 1e-8)).astype(np.float32)

        tensor = torch.from_numpy(data).unsqueeze(0).unsqueeze(0).to(self.device)
        return tensor, voxel_ml

    def compute_volumes_mass(self, mask, voxel_ml):
        lv = np.sum(mask == 1) * voxel_ml
        rv = np.sum(mask == 2) * voxel_ml
        myo = np.sum(mask == 3) * voxel_ml
        mass = myo * 1.05
        return lv, rv, myo, mass

    def compute_ef(self, ed, es):
        return ((ed - es) / ed * 100) if ed > 0 else 0.0

    def run_inference(self, ed_path, es_path):
        """
        Args:
            ed_path (str): Path to ED phase NIfTI
            es_path (str): Path to ES phase NIfTI
        Returns:
            dict: Seg masks, volumes, mass, EF, and label
        """
        # Preprocess both phases
        ed_tensor, voxel_ml = self._preprocess(ed_path)
        es_tensor, _ = self._preprocess(es_path)

        with torch.no_grad():
            ed_logits = self.swin_model(ed_tensor)
            es_logits = self.swin_model(es_tensor)

        ed_mask = torch.argmax(ed_logits, dim=1).squeeze().cpu().numpy()
        es_mask = torch.argmax(es_logits, dim=1).squeeze().cpu().numpy()

        # Compute volumes and mass
        ed_lv, ed_rv, ed_myo, ed_mass = self.compute_volumes_mass(ed_mask, voxel_ml)
        es_lv, es_rv, es_myo, _ = self.compute_volumes_mass(es_mask, voxel_ml)

        # Compute ejection fractions
        lv_ef = self.compute_ef(ed_lv, es_lv)
        rv_ef = self.compute_ef(ed_rv, es_rv)

        # Prepare features and classify
        features = np.array([ed_lv, es_lv, ed_rv, es_rv, ed_myo, ed_mass, lv_ef, rv_ef]).reshape(1, -1)
        pred = self.rf_model.predict(features)[0]
        label = 'HCM' if pred == 1 else 'Non-HCM'

        # Pack results
        results = {
            'ed_mask': ed_mask,
            'es_mask': es_mask,
            'ed_lv_ml': ed_lv,
            'es_lv_ml': es_lv,
            'ed_rv_ml': ed_rv,
            'es_rv_ml': es_rv,
            'ed_myo_ml': ed_myo,
            'myo_mass_g': ed_mass,
            'lv_ef_pct': lv_ef,
            'rv_ef_pct': rv_ef,
            'classification': label
        }
        return results

# Instantiate analyzer
_analyzer = CardiacAnalyzer()

# Helper function
def run_inference(ed_file, es_file):
    """Returns a dict containing segmentation masks, cardiac parameters, and 'classification' label."""
    return _analyzer.run_inference(ed_file, es_file)
