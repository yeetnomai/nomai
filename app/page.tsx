import Link from 'next/link';
import Image from 'next/image';
import IntroOverlay from '@/components/IntroOverlay';

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <IntroOverlay />
      <div className="jumbotron p-5 mb-5 bg-white rounded-3 shadow-lg animate-fade-in position-relative overflow-hidden">
        {/* Decorative background element if needed */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-light opacity-50" style={{ zIndex: 0 }}></div>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-4 fw-bold text-gradient mb-3">ระบบบริหารจัดการนักเรียนนักศึกษา</h1>
          <p className="lead text-muted mb-4">วิทยาลัยเทคนิคลำปาง</p>
          <hr className="my-4" />
          <p className="mb-5 text-secondary">เว็ปที่ดีที่สุดในจักรวาล</p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link href="/login" className="btn btn-primary btn-lg px-5 py-3 gap-3 shadow-sm">
              เข้าสู่ระบบ (Login)
            </Link>
            <Link href="/register" className="btn btn-outline-primary btn-lg px-5 py-3 shadow-sm">
              ลงทะเบียนนักศึกษาใหม่
            </Link>
          </div>
        </div>
      </div>

      <div className="row mt-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="col-md-4 mb-4">
          <Link href="/login?type=student" className="text-decoration-none text-dark">
            <div className="card h-100 border-0 shadow-sm dashboard-card">
              <div className="card-body text-center p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-person-badge display-4"></i>
                </div>
                <h5 className="card-title fw-bold">สำหรับนักศึกษา</h5>
                <p className="card-text text-muted">ตรวจสอบข้อมูลส่วนตัว ผลการเรียน และดูประกาศต่างๆ</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link href="/login?type=admin" className="text-decoration-none text-dark">
            <div className="card h-100 border-0 shadow-sm dashboard-card">
              <div className="card-body text-center p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-briefcase display-4"></i>
                </div>
                <h5 className="card-title fw-bold">สำหรับบุคลากร</h5>
                <p className="card-text text-muted">จัดการข้อมูลนักศึกษา และดูแลระบบการศึกษา</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link href="/departments" className="text-decoration-none text-dark">
            <div className="card h-100 border-0 shadow-sm dashboard-card">
              <div className="card-body text-center p-4">
                <div className="text-primary mb-3">
                  <i className="bi bi-laptop display-4"></i>
                </div>
                <h5 className="card-title fw-bold">แผนกวิชา</h5>
                <p className="card-text text-muted">เทคโนโลยีคอมพิวเตอร์ และสาขาอื่นๆ</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
